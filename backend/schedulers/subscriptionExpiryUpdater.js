const schedule = require("node-schedule");
const Tenant = require("../models/Tenant.schema");
const logger = require("../config/logger");

const BATCH_SIZE = 50; // Number of tenants to process in each batch

/**
 * Function to update expired subscriptions in batches
 */
const updateExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0)); // Set to today's date at midnight

    // Find tenants whose subscription has ended but status is not "Expired"
    const filters = {
      subscription_status: { $ne: "Expired" }, // Not already marked expired
      subscription_end_date: { $lt: today }, // Subscription date has passed
    };

    const totalTenants = await Tenant.countDocuments(filters);
    logger.info(`Total tenants to update: ${totalTenants}`);

    const totalBatches = Math.ceil(totalTenants / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
      logger.info(`Processing batch ${batch + 1} of ${totalBatches}`);

      // Fetch tenants in batches
      const tenants = await Tenant.find(filters)
        .sort({ subscription_end_date: 1 }) // Process oldest expired first
        .skip(batch * BATCH_SIZE)
        .limit(BATCH_SIZE);

      // Update the status of each tenant
      await Promise.all(
        tenants.map(async (tenant) => {
          try {
            tenant.subscription_status = "Expired";
            await tenant.save();
            logger.info(`Marked tenant ${tenant.company_name} as Expired.`);
          } catch (error) {
            logger.error(
              `Failed to update tenant ${tenant.company_name}: ${error.message}`,
            );
          }
        }),
      );

      logger.info(`Batch ${batch + 1} of ${totalBatches} processed.`);
    }

    logger.info("All expired subscriptions updated successfully.");
  } catch (error) {
    logger.error("Error updating expired subscriptions: " + error.message);
  }
};

// // Schedule the task to run every day at 10:00 AM
schedule.scheduleJob("0 10 * * *", () => {
  logger.info("Running daily subscription expiry check...");
  updateExpiredSubscriptions();
});

// ✅ Run every 2 minutes for testing
// schedule.scheduleJob("*/2 * * * *", () => {
//   logger.info(
//     "Running subscription expiry check (Every 2 minutes for testing)...",
//   );
//   updateExpiredSubscriptions();
// });
