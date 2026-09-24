const schedule = require("node-schedule");
const Tenant = require("../models/Tenant.schema");
const sendEmail = require("../utils/sendEmail");
const logger = require("../config/logger");

const BATCH_SIZE = 50; // Number of tenants to process in each batch

/**
 * Function to fetch tenants in batches and send reminder emails
 */
const processTenantsInBatches = async () => {
  try {
    const now = new Date();
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(now.getDate() + 1);

    // Filter for tenants with subscriptions expiring the next day
    const filters = {
      subscription_status: "Active",
      subscription_end_date: {
        $gte: oneDayFromNow.setHours(0, 0, 0, 0),
        $lte: oneDayFromNow.setHours(23, 59, 59, 999),
      },
    };

    const totalTenants = await Tenant.countDocuments(filters);
    logger.info(`Total tenants to process: ${totalTenants}`);

    // Calculate number of batches
    const totalBatches = Math.ceil(totalTenants / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
      logger.info(`Processing batch ${batch + 1} of ${totalBatches}`);

      // Fetch tenants for the current batch
      const tenants = await Tenant.find(filters)
        .populate("tenant_owner", "name email")
        .populate("subscription_plan", "name")
        .sort({ created_at: -1 })
        .skip(batch * BATCH_SIZE)
        .limit(BATCH_SIZE);

      // Send emails for the current batch
      await Promise.all(
        tenants.map(async (tenant) => {
          const {
            tenant_owner,
            company_name,
            subscription_plan,
            subscription_end_date,
          } = tenant;

          if (!tenant_owner || !tenant_owner.email) {
            console.warn(
              `Skipping tenant ${tenant.company_name} due to missing owner email.`,
            );
            return;
          }

          const email = tenant_owner.email;

          const subject = "Subscription Expiry Reminder";
          const text = `
            Dear ${tenant_owner.name},

            This is a friendly reminder that your subscription plan ${
              subscription_plan?.name || "Unnamed Plan"
            } for your company, ${company_name}, is set to expire on ${new Date(
              subscription_end_date,
            ).toDateString()}.

            Please renew your subscription to continue enjoying uninterrupted service.

            Best regards,
            Your Company Team
          `;

          try {
            await sendEmail({ email, subject, text });
          } catch (error) {
            logger.error(
              `Failed to send email to ${email} for tenant ${company_name}: ${error.message}`,
            );
          }
        }),
      );

      console.log(`Batch ${batch + 1} of ${totalBatches} processed.`);
    }

    console.log("All batches processed successfully.");
  } catch (error) {
    logger.error("Failed to process tenants in batches:" + error.message);
  }
};

// Schedule the task to run every day at 9:00 AM
schedule.scheduleJob("0 9 * * *", () => {
  logger.info("Running scheduled task to check for expiring subscriptions.");
  processTenantsInBatches();
});
