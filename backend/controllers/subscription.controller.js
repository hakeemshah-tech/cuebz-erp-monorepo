const SubscriptionOrder = require("../models/SubscriptionOrder.schema");
const SubscriptionPlan = require("../models/SubscriptionPlan.schema");
const TenantSchema = require("../models/Tenant.schema");
const AppError = require("../utils/appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// TODO: Pending Edit Subscription plan pending
const createStripePlan = async (req, res) => {
  const { name, description, price, interval, interval_count, trial_duration } =
    req.body;

  try {
    // Validate interval_count to ensure it's a number (optional step)
    if (!["1", "3", "6"].includes(interval_count)) {
      return res.status(400).json({
        error: "Invalid interval_count value. Must be '1', '3', or '6'.",
      });
    }

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name,
      description,
    });

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert AED to the smallest currency unit (fils)
      currency: "aed", // Set currency to AED
      recurring: {
        interval: interval, // Set the interval (e.g., "month", "year")
        interval_count: parseInt(interval_count, 10), // Convert string to integer for Stripe
      },
      product: stripeProduct.id,
    });

    // Save the plan in the database
    const subscriptionPlan = await SubscriptionPlan.create({
      name,
      description,
      price,
      interval, // Save interval (e.g., "month", "year")
      interval_count, // Save interval count (e.g., "1", "3", "6")
      trial_duration,
      features: { max_organization: 1, max_users: 10 },
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });

    res.status(201).json({
      message: "Subscription plan created successfully.",
      subscriptionPlan,
    });
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    res.status(500).json({ error: "Failed to create subscription plan." });
  }
};

// Get all subscription plans
const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({
      message: "Subscription plans retrieved successfully.",
      data: plans,
    });
  } catch (error) {
    console.error("Error retrieving subscription plans:", error);
    res.status(500).json({ error: "Failed to retrieve subscription plans." });
  }
};

// Get a subscription plan by ID
const getSubscriptionPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await SubscriptionPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found." });
    }
    res
      .status(200)
      .json({ message: "Subscription plan retrieved successfully.", plan });
  } catch (error) {
    console.error("Error retrieving subscription plan:", error);
    res.status(500).json({ error: "Failed to retrieve subscription plan." });
  }
};

const deleteSubscriptionPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found." });
    }

    // Fetch all prices associated with the product
    const prices = await stripe.prices.list({ product: plan.stripeProductId });

    // Deactivate each price
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
    }

    // Delete the associated Stripe product
    await stripe.products.update(plan.stripeProductId, { active: false });

    //Nullify the references in other collections
    if (plan) {
      await Promise.all([
        SubscriptionOrder.updateMany(
          { subscription_plan: id },
          { $set: { subscription_plan: null } },
        ),
        TenantSchema.updateMany(
          { subscription_plan: id },
          { $set: { subscription_plan: null } },
        ),
      ]);
    }

    res
      .status(200)
      .json({ message: "Subscription plan deleted successfully.", plan });
  } catch (error) {
    console.error("Error deleting subscription plan:", error.message);
    res.status(500).json({ error: "Failed to delete subscription plan." });
  }
};

//--------------TENANT BASED-------------------------------

// const createTenantSubscription = async (req, res) => {
//   const { tenantOwnerId, subscriptionPlanId, company_name } = req.body;

//   try {
//     // Validate tenant owner
//     const tenantOwner = await UserSchema.findById(tenantOwnerId);
//     if (!tenantOwner || tenantOwner.role !== "tenant-owner") {
//       return res.status(404).json({ error: "Invalid tenant owner." });
//     }

//     // Validate subscription plan
//     const subscriptionPlan =
//       await SubscriptionPlan.findById(subscriptionPlanId);
//     if (!subscriptionPlan) {
//       return res.status(404).json({ error: "Subscription plan not found." });
//     }

//     // Create a Stripe Customer for the tenant owner (if not exists)
//     if (!tenantOwner.stripeCustomerId) {
//       const stripeCustomer = await stripe.customers.create({
//         email: tenantOwner.email,
//         name: tenantOwner.name,
//       });

//       tenantOwner.stripeCustomerId = stripeCustomer.id;
//       await tenantOwner.save();
//     }

//     const trialEndDate = new Date(
//       Date.now() + subscriptionPlan.trial_duration * 24 * 60 * 60 * 1000,
//     );

//     // Create a subscription with a free trial
//     const stripeSubscription = await stripe.subscriptions.create({
//       customer: tenantOwner.stripeCustomerId,
//       items: [{ price: subscriptionPlan.stripePriceId }],
//       trial_end: Math.floor(trialEndDate.getTime() / 1000), // Stripe accepts trial_end in Unix time
//     });

//     // Create Tenant
//     const tenant = await TenantSchema.create({
//       company_name: company_name, // Example company name
//       tenant_owner: tenantOwner._id,
//       subscription_plan: subscriptionPlan._id,
//       subscription_start_date: new Date(),
//       subscription_end_date: trialEndDate,
//       subscription_status: "Trialing",
//     });

//     // Update tenant owner with tenant ID
//     tenantOwner.tenant_id = tenant._id;
//     await tenantOwner.save();

//     // Create Subscription Order
//     const subscriptionOrder = await SubscriptionOrderSchema.create({
//       tenant_id: tenant._id,
//       subscription_plan: subscriptionPlan._id,
//       stripeSubscriptionId: stripeSubscription.id,
//       amount: subscriptionPlan.price, // Free trial or plan price
//       status: "Trialing",
//       trial_end_date: trialEndDate,
//     });

//     res.status(201).json({
//       message: "Tenant created and subscription initialized successfully.",
//       tenant,
//       subscriptionOrder,
//     });
//   } catch (error) {
//     console.error("Error creating tenant after subscription:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to create tenant and initialize subscription." });
//   }
// };

// SUBSCRIPTION THINGS---------------------------------
const createStripeCheckout = async (req, res, next) => {
  try {
    console.log(req.user.tenant_id.stripeCustomerId, "show");
    const { priceId } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: req.user.tenant_id.stripeCustomerId, // Add the customer ID here

      success_url: `${process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL_LIVE : process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL_LIVE : process.env.FRONTEND_URL}/failed`,
    });

    res.status(200).json({ message: "Stripe Checkout Intiated", session });
  } catch (error) {
    next(error);
  }
};

const stripeCustomerBillingPortal = async (req, res, next) => {
  try {
    // Fetch tenant information from the authenticated user
    const { tenant_id } = req.user;
    if (!tenant_id) {
      return next(new AppError("Tenant ID is required.", 400));
    }

    // Find tenant by ID
    const tenant = await TenantSchema.findById(tenant_id._id);
    console.log(tenant, "got it");
    if (!tenant || !tenant.stripeCustomerId) {
      return next(
        new AppError("Tenant not found or Stripe customer ID is missing.", 404),
      );
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}`, // Redirect after portal usage
    });

    res.status(200).json({
      message: "Billing portal session created successfully.",
      data: { url: session.url }, // Send the URL back to the client
    });
  } catch (error) {
    console.error("Error creating billing portal session:", error.message);
    next(error);
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret =
    process.env.NODE_ENV === "development"
      ? process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE;

  let event;
  // const event = request.body;

  // Verify the webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      /**
       * Triggered when a subscription is successfully created.
       * Use this to initialize subscription-related data.
       */
      // case "customer.subscription.created": {
      //   const createdSubscription = event.data.object;
      //   console.log("Subscription created:", createdSubscription);

      //   const stripePriceId = createdSubscription.items.data[0].price.id;

      //   // Fetch the corresponding internal subscription plan
      //   const internalPlan = await SubscriptionPlan.findOne({
      //     stripePriceId,
      //   });
      //   if (!internalPlan) {
      //     console.error(
      //       `No internal subscription plan found for Stripe Price ID: ${stripePriceId}`,
      //     );
      //     break;
      //   }

      //   // Update tenant with subscription details
      //   const tenantOnCreate = await TenantSchema.findOne({
      //     stripeCustomerId: createdSubscription.customer,
      //   });
      //   if (tenantOnCreate) {
      //     tenantOnCreate.subscription_plan = internalPlan._id; // Save MongoDB ObjectId
      //     tenantOnCreate.stripeSubscriptionId = createdSubscription.id; // Save Stripe subscription ID
      //     tenantOnCreate.subscription_status =
      //       createdSubscription.status === "active"
      //         ? "Active"
      //         : "Pending Update"; // Use Stripe-provided status
      //     tenantOnCreate.subscription_start_date = new Date(
      //       createdSubscription.current_period_start * 1000,
      //     );
      //     tenantOnCreate.subscription_end_date = new Date(
      //       createdSubscription.current_period_end * 1000,
      //     );
      //     await tenantOnCreate.save();

      //     // Create subscription order for tracking
      //     await SubscriptionOrder.create({
      //       tenant_id: tenantOnCreate._id,
      //       subscription_plan: internalPlan._id,
      //       stripeSubscriptionId: createdSubscription.id,
      //       amount: internalPlan.price,
      //       status:
      //         createdSubscription.status === "active" ? "Paid" : "Pending",
      //       start_date: new Date(
      //         createdSubscription.current_period_start * 1000,
      //       ),
      //       end_date: new Date(createdSubscription.current_period_end * 1000),
      //     });

      //     console.log(
      //       `Tenant ${tenantOnCreate.company_name} subscription created.`,
      //     );
      //   } else {
      //     console.error(
      //       `No tenant found for Stripe Customer ID: ${createdSubscription.customer}`,
      //     );
      //   }
      //   break;
      // }

      /**
       * Triggered when a payment for a subscription is successful.
       * Use this to confirm the subscription activation.
       */
      case "invoice.payment_succeeded": {
        const succeededInvoice = event.data.object;
        console.log("Payment succeeded:", succeededInvoice);

        const stripeCustomerId = succeededInvoice.customer;

        // Fetch the tenant using stripeCustomerId
        const tenantOnPayment = await TenantSchema.findOne({
          stripeCustomerId,
        });

        if (tenantOnPayment) {
          // Fetch the latest subscription details using the subscription ID
          const stripeSubscriptionId = succeededInvoice.subscription;
          const subscription =
            await stripe.subscriptions.retrieve(stripeSubscriptionId);

          if (!subscription) {
            console.error(
              `No subscription found for ID: ${stripeSubscriptionId}`,
            );
            break;
          }

          const stripePriceId = subscription.items.data[0].price.id;

          // Fetch the corresponding internal subscription plan
          const internalPlan = await SubscriptionPlan.findOne({
            stripePriceId,
          });

          if (!internalPlan) {
            console.error(
              `No internal subscription plan found for Stripe Price ID: ${stripePriceId}`,
            );
            break;
          }

          // Set subscription_start_date only if it's the first subscription
          if (!tenantOnPayment.subscription_start_date) {
            tenantOnPayment.subscription_start_date = new Date(
              subscription.start_date * 1000, // Use the subscription start date
            );
          }

          // Update tenant subscription details
          tenantOnPayment.subscription_plan = internalPlan._id; // Update plan
          tenantOnPayment.subscription_status = "Active"; // Payment confirms activation
          tenantOnPayment.current_period_start = new Date(
            subscription.current_period_start * 1000,
          ); // Update current period start
          tenantOnPayment.subscription_end_date = new Date(
            subscription.current_period_end * 1000,
          ); // Update current period end
          tenantOnPayment.stripeSubscriptionId = subscription.id; // Update subscription ID

          console.log("Tenant Data Before Save:", tenantOnPayment);

          try {
            await tenantOnPayment.save();
            console.log(
              `Tenant subscription updated successfully: ${tenantOnPayment.company_name}`,
            );
          } catch (saveError) {
            console.error(
              "Error saving tenant subscription details:",
              saveError,
            );
          }

          // Create or update the subscription order
          await SubscriptionOrder.findOneAndUpdate(
            { stripeSubscriptionId },
            {
              tenant_id: tenantOnPayment._id,
              subscription_plan: internalPlan._id,
              stripeInvoiceId: succeededInvoice.id,
              stripeSubscriptionId,
              amount: succeededInvoice.amount_paid / 100, // Convert cents to AED
              status: "Paid",
              start_date: new Date(subscription.current_period_start * 1000),
              end_date: new Date(subscription.current_period_end * 1000),
            },
            { upsert: true, new: true },
          );

          console.log(
            `Payment succeeded for tenant: ${tenantOnPayment.company_name}`,
          );
        } else {
          console.error(
            `No tenant found for Stripe Customer ID: ${stripeCustomerId}`,
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        console.log(event.data.object, "hittingggg");
        const updatedSubscription = event.data.object;
        console.log("Subscription updated:", updatedSubscription);

        const stripeCustomerId = updatedSubscription.customer;

        // Find the tenant using stripeCustomerId
        const tenantOnUpdate = await TenantSchema.findOne({
          stripeCustomerId,
        });

        if (tenantOnUpdate) {
          const currentPlan = await SubscriptionPlan.findById(
            tenantOnUpdate.subscription_plan,
          );

          if (!currentPlan) {
            console.error(
              `No internal subscription plan found for tenant: ${tenantOnUpdate.company_name}`,
            );
            break;
          }

          // Get the new plan's Stripe Price ID
          const newStripePriceId = updatedSubscription.items.data[0].price.id;

          if (currentPlan.stripePriceId !== newStripePriceId) {
            // Plan Change Detected
            console.log(
              `Plan changed for tenant: ${tenantOnUpdate.company_name}. Updating to new plan.`,
            );

            // Fetch the new plan
            const newPlan = await SubscriptionPlan.findOne({
              stripePriceId: newStripePriceId,
            });

            if (!newPlan) {
              console.error(
                `No matching internal plan found for new Stripe Price ID: ${newStripePriceId}`,
              );
              break;
            }

            // Update tenant with the new plan and subscription details
            tenantOnUpdate.subscription_plan = newPlan._id;
            tenantOnUpdate.subscription_status =
              updatedSubscription.status === "active"
                ? "Active"
                : "Pending Update";
            tenantOnUpdate.current_period_start = new Date(
              updatedSubscription.current_period_start * 1000,
            );
            tenantOnUpdate.subscription_end_date = new Date(
              updatedSubscription.current_period_end * 1000,
            );
            tenantOnUpdate.stripeSubscriptionId = updatedSubscription.id; // Update subscription ID
            await tenantOnUpdate.save();

            console.log(
              `Plan updated to ${newPlan.name} for tenant: ${tenantOnUpdate.company_name}.`,
            );
          } else {
            // Renewal Detected
            console.log(
              `Renewal detected for tenant: ${tenantOnUpdate.company_name}`,
            );

            tenantOnUpdate.subscription_status =
              updatedSubscription.status === "active"
                ? "Active"
                : "Pending Update";
            tenantOnUpdate.current_period_start = new Date(
              updatedSubscription.current_period_start * 1000,
            );
            tenantOnUpdate.subscription_end_date = new Date(
              updatedSubscription.current_period_end * 1000,
            );
            tenantOnUpdate.stripeSubscriptionId = updatedSubscription.id; // Update subscription ID
            await tenantOnUpdate.save();

            console.log(
              `Renewal processed for tenant: ${tenantOnUpdate.company_name}.`,
            );
          }
        } else {
          console.error(
            `No tenant found for Stripe Customer ID: ${stripeCustomerId}`,
          );
        }
        break;
      }

      // case "customer.subscription.updated": {
      //   const updatedSubscription = event.data.object;
      //   console.log("Subscription updated:", updatedSubscription);

      //   const stripeCustomerId = updatedSubscription.customer;

      //   // Find the tenant using stripeCustomerId
      //   const tenantOnUpdate = await TenantSchema.findOne({
      //     stripeCustomerId,
      //   });

      //   if (tenantOnUpdate) {
      //     const currentPlan = await SubscriptionPlan.findById(
      //       tenantOnUpdate.subscription_plan,
      //     );

      //     if (!currentPlan) {
      //       console.error(
      //         `No internal subscription plan found for tenant: ${tenantOnUpdate.company_name}`,
      //       );
      //       break;
      //     }

      //     // Get the new plan's Stripe Price ID
      //     const newStripePriceId = updatedSubscription.items.data[0].price.id;

      //     if (currentPlan.stripePriceId !== newStripePriceId) {
      //       // Plan Change Detected
      //       console.log(
      //         `Plan changed for tenant: ${tenantOnUpdate.company_name}. Updating to new plan.`,
      //       );

      //       // Fetch the new plan
      //       const newPlan = await SubscriptionPlan.findOne({
      //         stripePriceId: newStripePriceId,
      //       });

      //       if (!newPlan) {
      //         console.error(
      //           `No matching internal plan found for new Stripe Price ID: ${newStripePriceId}`,
      //         );
      //         break;
      //       }

      //       // Update tenant with the new plan
      //       tenantOnUpdate.subscription_plan = newPlan._id;
      //       tenantOnUpdate.subscription_status =
      //         updatedSubscription.status === "active"
      //           ? "Active"
      //           : "Pending Update";
      //       tenantOnUpdate.current_period_start = new Date(
      //         updatedSubscription.current_period_start * 1000,
      //       );
      //       tenantOnUpdate.subscription_end_date = new Date(
      //         updatedSubscription.current_period_end * 1000,
      //       );
      //       await tenantOnUpdate.save();

      //       console.log(
      //         "End-date-subscription_succeed",
      //         new Date(updatedSubscription.current_period_end * 1000),
      //       );

      //       console.log(
      //         `Plan updated to ${newPlan.name} for tenant: ${tenantOnUpdate.company_name}.`,
      //       );
      //     } else {
      //       // Renewal Detected
      //       console.log(
      //         `Renewal detected for tenant: ${tenantOnUpdate.company_name}`,
      //       );

      //       tenantOnUpdate.subscription_status =
      //         updatedSubscription.status === "active"
      //           ? "Active"
      //           : "Pending Update";
      //       tenantOnUpdate.current_period_start = new Date(
      //         updatedSubscription.current_period_start * 1000,
      //       );
      //       tenantOnUpdate.subscription_end_date = new Date(
      //         updatedSubscription.current_period_end * 1000,
      //       );
      //       await tenantOnUpdate.save();

      //       console.log(
      //         `Renewal processed for tenant: ${tenantOnUpdate.company_name}.`,
      //       );
      //     }
      //   } else {
      //     console.error(
      //       `No tenant found for Stripe Customer ID: ${stripeCustomerId}`,
      //     );
      //   }
      //   break;
      // }

      /**
       * Triggered when a payment for a subscription fails.
       * Use this to update the subscription status to "Payment Failed."
       */

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object;
        console.log("Payment failed:", failedInvoice);

        const stripeCustomerId = failedInvoice.customer;

        // Find the tenant using stripeCustomerId
        const tenantOnFailedPayment = await TenantSchema.findOne({
          stripeCustomerId,
        });

        if (tenantOnFailedPayment) {
          tenantOnFailedPayment.subscription_status = "Payment Failed";
          await tenantOnFailedPayment.save();

          console.log(
            `Payment failed for tenant: ${tenantOnFailedPayment.company_name}`,
          );
        } else {
          console.error(
            `No tenant found for Stripe Customer ID: ${stripeCustomerId}`,
          );
        }
        break;
      }

      /**
       * Triggered when a subscription is deleted (canceled or expired).
       * Use this to mark the subscription as expired.
       */

      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object;
        console.log("Subscription deleted:", deletedSubscription);

        // Find the tenant using the Stripe customer ID
        const tenantOnDelete = await TenantSchema.findOne({
          stripeCustomerId: deletedSubscription.customer,
        });

        if (tenantOnDelete) {
          // Update the tenant's subscription status to "Expired"
          tenantOnDelete.subscription_status = "Expired";
          tenantOnDelete.subscription_end_date = new Date(); // Set to the current date
          tenantOnDelete.current_period_start = null; // Clear current period start
          await tenantOnDelete.save();

          // Optionally: Notify the tenant
          console.log(
            `Tenant ${tenantOnDelete.company_name} subscription marked as expired.`,
          );

          // Additional cleanup actions:
          // Disable tenant access or set a flag to restrict usage
          // Notify your system administrators if needed
          // Trigger email notifications to the customer (e.g., "Your subscription has expired")
        } else {
          console.error(
            `No tenant found for Stripe Customer ID: ${deletedSubscription.customer}`,
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send("Webhook received.");
  } catch (error) {
    console.error("Error handling webhook event:", error.message);
    res.status(500).send("Webhook handler error.");
  }
};

module.exports = {
  createStripePlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  deleteSubscriptionPlan,
  createStripeCheckout,
  stripeWebhook,
  stripeCustomerBillingPortal,
};
