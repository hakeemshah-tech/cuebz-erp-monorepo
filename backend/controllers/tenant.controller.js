const User = require("../models/User.schema");
const bcrypt = require("bcrypt");
const TenantSchema = require("../models/Tenant.schema");
const UserSchema = require("../models/User.schema");
const SubscriptionOrder = require("../models/SubscriptionOrder.schema");
const SubscriptionPlan = require("../models/SubscriptionPlan.schema");

const stripe = require("../config/stripe");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const AppError = require("../utils/appError");
const organizationSchema = require("../models/Organization.schema");
const sendEmail = require("../utils/sendEmail");

// Register Tenant User in User Collection
const createTenantByAdmin = async (req, res, next) => {
  const {
    name,
    email,
    password,
    company_name,
    employees_count,
    business_category,
  } = req.body;

  try {
    // Check if a tenant-owner already exists
    // const existingTenantOwner = await User.findOne({  role: "tenant-owner" });
    // if (existingTenantOwner) {
    //   return next(new AppError("A tenant-owner account already exists.", 403));
    // }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email is already registered.", 400));
    }

    // Check if the company name is unique
    const existingTenant = await TenantSchema.findOne({ company_name });
    if (existingTenant) {
      return next(new AppError("Company name already exists.", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the tenant-owner account
    const tenantOwner = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "tenant-owner", // Hardcoded as tenant-owner
      tenant_id: null, // Will be updated after tenant creation
      isVerified: true,
    });

    // Calculate trial start and end dates
    const subscription_start_date = new Date();
    const subscription_end_date = new Date(subscription_start_date);
    subscription_end_date.setDate(subscription_start_date.getDate() + 20); // Add 20 days for free trial

    // Create a Stripe Customer for the tenant-owner
    const stripeCustomer = await stripe.customers.create({
      email: tenantOwner.email,
      name: tenantOwner.name,
      metadata: {
        tenant_owner_id: tenantOwner._id.toString(), // Metadata to easily associate with tenant owner
        company_name,
      },
    });

    // Create the tenant
    const tenant = await TenantSchema.create({
      company_name,
      tenant_owner: tenantOwner._id,
      subscription_start_date,
      subscription_end_date,
      subscription_status: "Trialing", // Default to Trialing
      stripeCustomerId: stripeCustomer.id, // Save Stripe customer ID
    });

    // Update the tenant-owner with the tenant ID
    tenantOwner.tenant_id = tenant._id;
    await tenantOwner.save();

    // Create the organization
    const organization = await organizationSchema.create({
      name: company_name,
      employees_count,
      business_category,
      tenant_id: tenant._id,
    });

    tenantOwner.selectedOrganization = organization._id;

    await tenantOwner.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL,
      to: tenantOwner.email,
      subject: "Account Created!",
      html: `
              <p>Hi ${tenantOwner.name},</p>
              <h3>Greetings!!! Welcome to the Platform!</h3>
              <p>You have successfully registered in this platform</p>
            `,
    };

    await sendEmail(mailOptions);

    res.status(201).json({
      message:
        "Tenant-owner and tenant registered successfully with a 20-day free trial.",
      user: tenantOwner,
      tenant,
    });
  } catch (error) {
    console.log("Error during registration:", error.message);
    res
      .status(500)
      .json({ error: "Failed to register tenant-owner and tenant." });
  }
};

// Get all tenants
// Get all tenants
const getAllTenants = async (req, res, next) => {
  const { search = "", status, subscriptionPlan } = req.query; // Extract status and subscriptionPlan from query
  const { page, limit, skip } = req.pagination;

  try {
    const query = {};

    // Add search filter for company_name
    if (search) {
      query.company_name = { $regex: search, $options: "i" };
    }

    // Add filter for subscription status
    if (status) {
      query.subscription_status = status; // Example: status="Active"
    }

    // Add filter for subscription plan
    if (subscriptionPlan) {
      query.subscription_plan = subscriptionPlan; // Example: subscriptionPlan="planId"
    }

    const tenants = await TenantSchema.find(query)
      .populate("tenant_owner", "name email") // Populate tenant-owner details
      .populate("subscription_plan") // Populate subscription plan details
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await TenantSchema.countDocuments(query);

    res.status(200).json({
      message: "Tenants retrieved successfully.",
      data: tenants,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get tenant by ID
const getTenantById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const tenant = await TenantSchema.findById(id)
      .populate("tenant_owner", "name email")
      .populate("subscription_plan");

    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    res.status(200).json({
      message: "Tenant retrieved successfully.",
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

// Update tenant
const updateTenant = async (req, res, next) => {
  const { id } = req.params;

  const updates = req.body;

  try {
    const updatedTenant = await TenantSchema.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    res.status(200).json({
      message: "Tenant updated successfully.",
      data: updatedTenant,
    });
  } catch (error) {
    next(error);
  }
};

// Delete tenant
const deleteTenant = async (req, res, next) => {
  const { id } = req.params;

  try {
    const tenant = await TenantSchema.findById(id);

    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    // Delete Stripe Customer if associated
    if (tenant.stripeCustomerId) {
      try {
        // Delete the Stripe Customer
        await stripe.customers.del(tenant.stripeCustomerId);

        console.log(
          `Successfully deleted Stripe customer: ${tenant.stripeCustomerId}`,
        );
      } catch (stripeError) {
        console.error(
          `Error deleting Stripe customer: ${tenant.stripeCustomerId}`,
          stripeError.message,
        );
        return next(
          new AppError(
            `Failed to delete associated Stripe customer: ${stripeError.message}`,
            500,
          ),
        );
      }
    }

    // Delete the tenant from the database
    await TenantSchema.findByIdAndDelete(id);

    // Optionally delete the tenant-owner associated with the tenant
    await UserSchema.findByIdAndDelete(tenant.tenant_owner);

    res.status(200).json({
      message: "Tenant and associated Stripe customer deleted successfully.",
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------Admin Manual Subscription Tasks------------------------------------

// Create a subscription for a tenant
const createTenantSubscription = async (req, res, next) => {
  const { tenantId, subscriptionPlanId } = req.body;

  try {
    // Validate tenant
    const tenant = await TenantSchema.findById(tenantId);
    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    // Validate subscription plan
    const subscriptionPlan =
      await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      return next(new AppError("Subscription plan not found.", 404));
    }

    // Calculate subscription dates
    const currentDate = new Date();
    const subscriptionStartDate = currentDate;

    const subscriptionEndDate = new Date(currentDate);
    const intervalCount = parseInt(subscriptionPlan.interval_count, 10);

    if (subscriptionPlan.interval === "month") {
      subscriptionEndDate.setMonth(
        subscriptionEndDate.getMonth() + intervalCount,
      );
    } else if (subscriptionPlan.interval === "year") {
      subscriptionEndDate.setFullYear(
        subscriptionEndDate.getFullYear() + intervalCount,
      );
    } else {
      return next(
        new AppError(
          "Invalid subscription interval. Only 'month' and 'year' are supported.",
          400,
        ),
      );
    }

    // Update tenant's subscription details
    tenant.subscription_plan = subscriptionPlan._id;
    tenant.subscription_start_date = subscriptionStartDate;
    tenant.subscription_end_date = subscriptionEndDate;
    tenant.current_period_start = subscriptionStartDate;
    tenant.subscription_status = "Active";
    await tenant.save();

    // Create a subscription order
    const subscriptionOrder = await SubscriptionOrder.create({
      tenant_id: tenant._id,
      subscription_plan: subscriptionPlan._id,
      amount: subscriptionPlan.price,
      status: "Paid",
      start_date: subscriptionStartDate,
      end_date: subscriptionEndDate,
    });

    res.status(201).json({
      message: "Subscription created successfully.",
      tenant,
      subscriptionOrder,
    });
  } catch (error) {
    next(error);
  }
};

const updateTenantSubscription = async (req, res, next) => {
  const { tenantId, subscriptionPlanId, startDate, endDate } = req.body;

  try {
    // Validate tenant
    const tenant = await TenantSchema.findById(tenantId);
    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    // Validate subscription plan
    const subscriptionPlan =
      await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      return next(new AppError("Subscription plan not found.", 404));
    }

    // Validate dates
    if (!startDate || !endDate) {
      return next(new AppError("Start date and end date are required.", 400));
    }

    const subscriptionStartDate = new Date(startDate);
    const subscriptionEndDate = new Date(endDate);

    if (subscriptionEndDate <= subscriptionStartDate) {
      return next(
        new AppError("End date must be greater than start date.", 400),
      );
    }

    // Determine subscription status based on dates
    const currentDate = new Date();
    let subscriptionStatus = "Active";

    if (subscriptionEndDate < currentDate) {
      subscriptionStatus = "Expired";
    }

    // Update tenant's subscription details
    tenant.subscription_plan = subscriptionPlan._id;
    tenant.subscription_start_date =
      tenant.subscription_start_date || subscriptionStartDate;
    tenant.subscription_end_date = subscriptionEndDate;
    tenant.current_period_start = subscriptionStartDate;
    tenant.subscription_status = subscriptionStatus;
    await tenant.save();

    res.status(200).json({
      message: "Subscription updated successfully.",
      tenant,
    });
  } catch (error) {
    next(error);
  }
};

// Renew subscription for a tenant
const renewTenantSubscription = async (req, res, next) => {
  const { tenantId, subscriptionPlanId } = req.body;

  try {
    // Validate tenant
    const tenant = await TenantSchema.findById(tenantId);
    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    // Validate subscription plan
    const subscriptionPlan =
      await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      return next(new AppError("Subscription plan not found.", 404));
    }

    // Calculate renewal dates
    const currentDate = new Date();
    const currentPeriodStart = currentDate;

    const subscriptionEndDate = new Date(currentPeriodStart);

    const intervalCount = parseInt(subscriptionPlan.interval_count, 10);

    if (subscriptionPlan.interval === "month") {
      subscriptionEndDate.setMonth(
        subscriptionEndDate.getMonth() + intervalCount,
      );
    } else if (subscriptionPlan.interval === "year") {
      subscriptionEndDate.setFullYear(
        subscriptionEndDate.getFullYear() + intervalCount,
      );
    } else {
      return next(
        new AppError(
          "Invalid subscription interval. Only 'month' and 'year' are supported.",
          404,
        ),
      );
    }

    // Update tenant's subscription details
    tenant.subscription_plan = subscriptionPlan._id;
    tenant.current_period_start = currentPeriodStart;
    tenant.subscription_end_date = subscriptionEndDate;
    tenant.subscription_status = "Active"; // Reset status to active
    await tenant.save();

    // Create a new subscription order
    const subscriptionOrder = await SubscriptionOrder.create({
      tenant_id: tenant._id,
      subscription_plan: subscriptionPlan._id,
      amount: subscriptionPlan.price, // Price from subscription plan
      status: "Paid",
      start_date: currentPeriodStart,
      end_date: subscriptionEndDate,
    });

    res.status(200).json({
      message: "Subscription renewed successfully.",
      tenant,
      subscriptionOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTenantByAdmin,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,

  renewTenantSubscription,
  updateTenantSubscription,
  createTenantSubscription,
};
