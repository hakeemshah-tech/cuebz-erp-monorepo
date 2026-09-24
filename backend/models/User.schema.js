const { default: mongoose } = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["super-admin", "super-admin-user", "tenant-owner", "tenant-user"],
//       required: true,
//     },
//     tenant_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Tenant",
//       required: function () {
//         return this.role === "tenant-user";
//       },
//     },
//     organization_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: function () {
//         return this.role === "tenant-user";
//       },
//     },
//     accessible_modules: [{ type: String }], // Modules accessible to this user
//     status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
//     isVerified: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.role !== "tenant-user";
      },
    },
    role: {
      type: String,
      enum: ["super-admin", "super-admin-user", "tenant-owner", "tenant-user"],
      required: true,
    },
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: function () {
        return this.role === "tenant-user";
      },
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: function () {
        return this.role === "tenant-user";
      },
    },
    accessible_modules: [
      {
        type: String,
        enum: [
          "dashboard",
          "visitor-log",
          "call-log",
          "documents",
          "employees",
          "task-management",
          "cheque-tracker",
          "credentials",
        ],
      },
    ],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String }, // General OTP
    otpExpiresAt: { type: Date }, // General OTP expiration

    credentials_otp: { type: String }, // Stores OTP for credential access
    expiry_credentials_otp: { type: Date }, // OTP expiration (15 mins)
    credentials_session_active_until: { type: Date }, // **Session Expiry**

    selectedOrganization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    resetOtpHash: { type: String, select: false },
    resetOtpExpiresAt: { type: Date, select: false },
    resetOtpAttempts: { type: Number, default: 0, select: false },
    resetFlowId: { type: String, select: false }, // correlates OTP/flow
    resetTokenHash: { type: String, select: false }, // one-time token after OTP
    resetTokenExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
