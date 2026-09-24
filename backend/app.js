const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { config } = require("dotenv");
const path = require("path");
// const { createClient } = require("redis");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");

const { passport } = require("./config/passport");
const dbConnection = require("./config/db");
// const redisConfig = require("./config/redisConfig");
const errorMiddleware = require("./middlewares/errorHandler");
const logRequest = require("./middlewares/loggingMiddleware");
// const logger = require("./config/logger");
const { normalLimiter } = require("./middlewares/rateLimiter");

// Determine NODE_ENV (fallback to development)
const env = process.env.NODE_ENV || "development";
config({ path: path.resolve(process.cwd(), `./env/.env.${env}`) });
console.log(`✅ Loaded environment: ${process.env.NODE_ENV || "development"}`);

// Stripe Configuration
require("./config/stripe");

// Scheduler
require("./schedulers/subscriptionExpiryNotifier");
require("./schedulers/subscriptionExpiryUpdater");

//Reminder email cron
const startReminderCron = require("./jobs/scanReminders");

// Routes
const authRoutes = require("./routes/auth.route");
const subscriptionRoutes = require("./routes/subscription.route");
const tenantRoutes = require("./routes/tenant.route");
const subscriptionOrderRoutes = require("./routes/subscriptionOrder.route");
const organizationRoutes = require("./routes/organization.route");
const visitorLogRoutes = require("./routes/visitor.route");
const callLogRoutes = require("./routes/callLog.route");
const employeeRoutes = require("./routes/employee.route");
const taskManagementRoute = require("./routes/taskManagement.route");
const rolesUserRoute = require("./routes/rolesUser.route");
const checkTrackerRoute = require("./routes/checkTracker.router");
const pettyCashRoute = require("./routes/pettyCash.route");
const customerRoute = require("./routes/customer.route");
const vendorRoute = require("./routes/vendor.route");
const leadRoute = require("./routes/lead.route");
const quotationRoute = require("./routes/quotation.route");
const invoiceRoute = require("./routes/invoice.route");
const documentRoute = require("./routes/document.route");
const credientialsRoute = require("./routes/credentials.route");
const eventCalendarRoute = require("./routes/eventCalendar.route");
const newsUpdateRoute = require("./routes/newsUpdate.route");
const assetRoute = require("./routes/asset.route");
const brandKitRoute = require("./routes/brandkit.route");
const analyticsRoute = require("./routes/analytics.route");
// const uploadRoute = require("./routes/upload.route");
const uploadRoute = require("./routes/upload.presign.route");

// Initialize Express app
const app = express();

// Redis client
// const redisClient = createClient({
//   socket: { host: redisConfig.host, port: redisConfig.port },
//   password: redisConfig.password,
// });
// redisClient.connect().catch(console.error);
// redisClient.on("ready", () => logger.info("Redis client connected."));
// redisClient.on("error", (err) => logger.error("Redis error:", err));

// Middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CORS_ORIGIN || "http://localhost:3002",
        "http://localhost:3005",
        "https://www.example.com",
        "https://app.example.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  "/api/subscription/webhook",
  bodyParser.raw({ type: "application/json" }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);
app.use(normalLimiter);
app.use(mongoSanitize());

// MongoDB connection
dbConnection();

// Passport initialization
app.use(passport.initialize());

// Health check routes
app.get("/", (req, res) => res.json({ message: "Working..." }));
app.get("/api", (req, res) => res.json({ message: "JWT auth working route." }));

// API Routes
app.use("/api/upload", uploadRoute);

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/subscription-orders", subscriptionOrderRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/visitors-log", visitorLogRoutes);
app.use("/api/call-log", callLogRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/taskmanagement", taskManagementRoute);
app.use("/api/roles-user", rolesUserRoute);
app.use("/api/chequetracker", checkTrackerRoute);
app.use("/api/pettycash", pettyCashRoute);
app.use("/api/customer", customerRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/lead", leadRoute);
app.use("/api/quotation", quotationRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/document", documentRoute);
app.use("/api/credentials", credientialsRoute);
app.use("/api/event-calendar", eventCalendarRoute);
app.use("/api/news", newsUpdateRoute);
app.use("/api/asset", assetRoute);
app.use("/api/brand-kit", brandKitRoute);
app.use("/api/analytics", analyticsRoute);
// app.use("/api/upload", uploadRoute);

//Reminder email cron
startReminderCron();

// Error handler
app.use(errorMiddleware);

module.exports = app;

// ===========================================================================

//  stripe listen --forward-to localhost:5000/api/subscription/webhook
// imny-htxb-wsiq-wvwo-qbhy

// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.SESSION_SECRET || "default_secret",
//     resave: false,
//     saveUninitialized: false,
//     // rolling: true,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
//   }),
// );

// app.use(
//   session({
//     name: "session",
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true, // Ensure HTTPS
//       httpOnly: true, // Prevent JS access
//       // sameSite: "none",
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//     },
//   }),
// );
