// const mongoose = require("mongoose");
// const crypto = require("crypto");
// const dotenv = require("dotenv");

// dotenv.config();

// // AES Encryption Helper
// const algorithm = "aes-256-cbc";
// const secretKey = process.env.ENCRYPTION_KEY_CREDIENTIALS;

// // Encryption function
// function encrypt(text) {
//   try {
//     const iv = crypto.randomBytes(16); // Ensure correct IV length
//     const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

//     let encrypted = cipher.update(text, "utf8", "hex");
//     encrypted += cipher.final("hex");

//     // Store IV along with encrypted data, separated by ":"
//     return `${iv.toString("hex")}:${encrypted}`;
//   } catch (error) {
//     console.error("Encryption error:", error.message);
//     throw new Error("Encryption failed.");
//   }
// }

// // Decryption function
// function decrypt(encryptedText) {
//   try {
//     if (!encryptedText || typeof encryptedText !== "string") {
//       console.error("Decryption Error: Invalid encrypted text received");
//       return null;
//     }

//     const parts = encryptedText.split(":");

//     if (parts.length !== 2) {
//       console.error("Decryption Error: Encrypted data format invalid");
//       return null;
//     }

//     const iv = Buffer.from(parts[0], "hex");
//     const encryptedData = parts[1];

//     if (iv.length !== 16) {
//       console.error("Decryption Error: IV must be 16 bytes but got", iv.length);
//       return null;
//     }

//     const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

//     let decrypted = decipher.update(encryptedData, "hex", "utf8");
//     decrypted += decipher.final("utf8");

//     return decrypted;
//   } catch (error) {
//     console.error("Decryption error:", error.message);
//     return null; // Prevents app crash
//   }
// }

// // Mongoose Schema
// const CredentialSchema = new mongoose.Schema(
//   {
//     tenant_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Tenant",
//       required: true,
//     },
//     organization_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: true,
//     },
//     platform: { type: String, required: true },
//     accounts: [
//       {
//         name: { type: String, required: true },
//         email: { type: String, required: true },
//         password: { type: String, required: true },
//       },
//     ],
//   },
//   { timestamps: true },
// );

// // 🔥 FIX: Encrypt password before saving (Ensure changes are detected)
// CredentialSchema.pre("save", function (next) {
//   if (!this.isModified("accounts")) return next();

//   const existingAccounts = this.isNew ? [] : this.accounts || [];

//   this.accounts = this.accounts.map((newAccount) => {
//     const existingAccount = existingAccounts.find(
//       (acc) => acc.email === newAccount.email,
//     );

//     // ✅ If password is already encrypted, don't re-encrypt
//     const isAlreadyEncrypted = newAccount.password.includes(":");

//     return existingAccount
//       ? existingAccount
//       : {
//           ...newAccount,
//           password: isAlreadyEncrypted
//             ? newAccount.password
//             : encrypt(newAccount.password),
//         };
//   });

//   this.markModified("accounts");
//   next();
// });

// // 🔥 FIX: Decrypt passwords when fetching data
// CredentialSchema.methods.getDecryptedAccounts = function () {
//   return this.accounts.map(({ _id, name, email, password }) => ({
//     _id,
//     name,
//     email,
//     password: password ? decrypt(password) || "Decryption Failed" : "N/A", // Prevent errors
//   }));
// };

// module.exports = mongoose.model("Credential", CredentialSchema);

const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Ensure Secret Key is Loaded & Valid
const algorithm = "aes-256-cbc";
const secretKeyHex = process.env.ENCRYPTION_KEY_CREDENTIALS; // Check correct env variable name

if (!secretKeyHex || secretKeyHex.length !== 64) {
  throw new Error(
    "ENCRYPTION_KEY_CREDENTIALS must be a 64-character hex string (32 bytes).",
  );
}

const secretKey = Buffer.from(secretKeyHex, "hex");

// ✅ Encryption function
function encrypt(text) {
  try {
    if (!text) throw new Error("Input text is empty.");

    const iv = crypto.randomBytes(16); // Ensure correct IV length
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Store IV along with encrypted data, separated by ":"
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error.message);
    throw new Error("Encryption failed.");
  }
}

// ✅ Decryption function
function decrypt(encryptedText) {
  try {
    if (!encryptedText || typeof encryptedText !== "string") {
      console.error("Decryption Error: Invalid encrypted text received");
      return null;
    }

    const parts = encryptedText.split(":");

    if (parts.length !== 2) {
      console.error("Decryption Error: Encrypted data format invalid");
      return null;
    }

    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = parts[1];

    if (iv.length !== 16) {
      console.error("Decryption Error: IV must be 16 bytes but got", iv.length);
      return null;
    }

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null; // Prevents app crash
  }
}

// ✅ Mongoose Schema
const CredentialSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    platform: { type: String, required: true },
    accounts: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

// 🔥 FIX: Encrypt passwords before saving
CredentialSchema.pre("save", function (next) {
  if (!this.isModified("accounts")) return next();

  console.log(this, "heyyaaa");

  this.accounts = this.accounts.map((account) => ({
    ...account,
    password: account.password.includes(":")
      ? account.password
      : encrypt(account.password),
  }));

  this.markModified("accounts");
  next();
});

// CredentialSchema.pre("save", async function (next) {
//   if (!this.isModified("accounts")) return next();

//   try {
//     console.log("Existing Document:", this);

//     // ✅ Retrieve existing accounts for the same platform if updating
//     if (!this.isNew) {
//       const existingCredential = await this.constructor.findOne({
//         tenant_id: this.tenant_id,
//         organization_id: this.organization_id,
//         platform: this.platform,
//       });

//       if (existingCredential) {
//         const existingAccounts = existingCredential.accounts || [];

//         // ✅ Merge accounts - Prevent duplicates & retain existing encrypted passwords
//         const updatedAccounts = [...existingAccounts];

//         this.accounts.forEach((newAccount) => {
//           const existingAccountIndex = updatedAccounts.findIndex(
//             (acc) => acc.email === newAccount.email,
//           );

//           if (existingAccountIndex !== -1) {
//             // ✅ If email exists, keep old password if not modified
//             updatedAccounts[existingAccountIndex] = {
//               ...updatedAccounts[existingAccountIndex],
//               ...newAccount,
//               password: newAccount.password.includes(":")
//                 ? newAccount.password
//                 : encrypt(newAccount.password),
//             };
//           } else {
//             // ✅ Encrypt & Add new account
//             updatedAccounts.push({
//               ...newAccount,
//               password: encrypt(newAccount.password),
//             });
//           }
//         });

//         this.accounts = updatedAccounts; // Save the merged accounts list
//       }
//     } else {
//       // ✅ Encrypt new accounts if no existing document
//       this.accounts = this.accounts.map((account) => ({
//         ...account,
//         password: encrypt(account.password),
//       }));
//     }

//     this.markModified("accounts"); // Mark accounts as modified
//     next();
//   } catch (error) {
//     console.error("Error merging accounts:", error);
//     next(error);
//   }
// });

// 🔥 FIX: Decrypt passwords when fetching data
CredentialSchema.methods.getDecryptedAccounts = function () {
  return this.accounts.map(({ _id, name, email, password }) => ({
    _id,
    name,
    email,
    password: password ? decrypt(password) || "Decryption Failed" : "N/A",
  }));
};

module.exports = mongoose.model("Credential", CredentialSchema);
