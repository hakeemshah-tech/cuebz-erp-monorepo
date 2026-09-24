const Organization = require("../models/Organization.schema");
const Employee = require("../models/Employee.schema");
const Customer = require("../models/Customer.schema");
const Lead = require("../models/Lead.schema");
const Task = require("../models/TaskManagement.schema");
const Vendor = require("../models/Vendor.schema");
const User = require("../models/User.schema");
const Asset = require("../models/asset.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const { encrypt, decrypt } = require("../utils/encryption"); // Utility functions for encryption/decryption
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Create Employee
// exports.createEmployee = async (req, res, next) => {
//   try {
//     const { body, files } = req;

//     console.log(body, "heyyy");

//     // Check if the organization belongs to the current user's tenant
//     const organization = await Organization.findOne({
//       _id: req.user.selectedOrganization,
//       tenant_id: req.user.tenant_id._id,
//     });
//     console.log(req.user, "show it");

//     if (!organization) {
//       return next(
//         new AppError(
//           "The specified organization does not belong to the current tenant.",
//           400,
//         ),
//       );
//     }

//     const uploadToCloudinary = (file, folder) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder,
//             resource_type: "auto",
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result.secure_url);
//             }
//           },
//         );

//         streamifier.createReadStream(file.buffer).pipe(stream);
//       });
//     };

//     // Encrypt sensitive fields
//     if (body.bank_details) {
//       body.bank_details = {
//         bank_name: body.bank_details.bank_name,
//         account_number: body.bank_details.account_number
//           ? encrypt(body.bank_details.account_number)
//           : undefined,
//         iban: body.bank_details.iban
//           ? encrypt(body.bank_details.iban)
//           : undefined,
//       };
//     }

//     // Prepare employee data
//     const employeeData = {
//       ...body,
//       tenant_id: req.user.tenant_id._id,
//       organization_id: req.user.selectedOrganization,
//     };

//     // Handle photo upload
//     if (files.photo) {
//       employeeData.photo = await uploadToCloudinary(
//         files.photo[0],
//         "employees/photos",
//       );
//     }

//     // Handle CV upload
//     if (files.cv) {
//       employeeData.cv = await uploadToCloudinary(files.cv[0], "employees/cvs");
//     }

//     // Handle visa copy upload
//     if (files.visa_copy) {
//       employeeData.visa_copy = await uploadToCloudinary(
//         files.visa_copy[0],
//         "employees/visa_copies",
//       );
//     }

//     // Handle Emirates ID upload
//     if (files.emirates_id) {
//       employeeData.emirates_id = await uploadToCloudinary(
//         files.emirates_id[0],
//         "employees/emirates_ids",
//       );
//     }

//     // Handle Emirates ID upload
//     if (files.passport_id) {
//       employeeData.passport_id = await uploadToCloudinary(
//         files.passport_id[0],
//         "employees/passport_ids",
//       );
//     }

//     // Create employee record
//     const employee = await Employee.create(employeeData);
//     console.log(employee, "here");

//     res.json({
//       message: "Employee created successfully.",
//       // data: employee,
//     });
//   } catch (error) {
//     console.log(error, "errorr");
//     next(error);
//   }
// };

exports.createEmployee = async (req, res, next) => {
  try {
    const { body } = req;

    // 1. Check if organization belongs to the current tenant
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return next(
        new AppError(
          "The specified organization does not belong to the current tenant.",
          400,
        ),
      );
    }

    // 2. Encrypt sensitive bank details if provided
    if (body.bank_details) {
      body.bank_details = {
        bank_name: body.bank_details.bank_name,
        account_number: body.bank_details.account_number
          ? encrypt(body.bank_details.account_number)
          : undefined,
        iban: body.bank_details.iban
          ? encrypt(body.bank_details.iban)
          : undefined,
        salary_transfer_mode: body.bank_details.salary_transfer_mode,
      };
    }

    // 3. Prepare final employee data
    const employeeData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,

      // File URLs already uploaded to S3 (via /api/upload)
      photo: body.photo || undefined,
      cv: body.cv || undefined,
      visa_copy: body.visa_copy || undefined,
      emirates_id: body.emirates_id || undefined,
      passport_id: body.passport_id || undefined,
    };

    // 4. Save to DB
    const employee = await Employee.create(employeeData);

    res.status(201).json({
      message: "Employee created successfully.",
      data: employee,
    });
  } catch (error) {
    console.error("Create employee error:", error);
    next(error);
  }
};

// Get All Employees with Filtering
exports.getAllEmployees = async (req, res, next) => {
  try {
    const {
      search,
      department,
      job_title,
      date_of_joining,
      reporting_manager,
      nationality,
    } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Add search filter
    if (search) {
      filters.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { personal_email: { $regex: search, $options: "i" } },
        { job_title: { $regex: search, $options: "i" } },
      ];
    }

    // Add department filter
    if (department) {
      filters.department = department;
    }

    // Add job title filter
    if (job_title) {
      filters.job_title = job_title;
    }

    // Add date of joining filter
    if (date_of_joining) {
      const parsedDate = new Date(date_of_joining);
      if (!isNaN(parsedDate.getTime())) {
        filters.date_of_joining = {
          $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
          $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
        };
      }
    }

    // Add reporting manager filter
    if (reporting_manager) {
      filters.reporting_manager = reporting_manager;
    }

    // Add nationality filter
    if (nationality) {
      filters.nationality = nationality;
    }

    const employees = await Employee.find(filters)
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .populate("reporting_manager", "full_name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ date_of_joining: -1 })
      .lean(); // Convert to plain objects to modify data

    const totalCount = await Employee.countDocuments(filters);

    // Decrypt bank details
    const decryptedEmployees = employees.map((employee) => {
      if (employee.bank_details) {
        return {
          ...employee,
          bank_details: {
            ...employee.bank_details,
            account_number: employee.bank_details.account_number
              ? decrypt(employee.bank_details.account_number)
              : "",
            iban: employee.bank_details.iban
              ? decrypt(employee.bank_details.iban)
              : "",
          },
        };
      }
      return employee;
    });

    res.status(200).json({
      message: "Employees retrieved successfully.",
      data: decryptedEmployees,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get Employee by ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id reporting_manager");

    if (!employee) {
      return next(new AppError("Employee not found.", 404));
    }

    // Decrypt sensitive fields
    if (employee.bank_details) {
      employee.bank_details.account_number = decrypt(
        employee.bank_details.account_number,
      );
      employee.bank_details.iban = decrypt(employee.bank_details.iban);
    }

    res.status(200).json({
      message: "Employee retrieved successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// exports.updateEmployee = async (req, res, next) => {
//   console.log(req.user, "show it");
//   try {
//     const { body, files } = req;

//     // Check if the organization belongs to the current user's tenant
//     const organization = await Organization.findOne({
//       _id: req.user.selectedOrganization,
//       tenant_id: req.user.tenant_id._id,
//     });

//     if (!organization) {
//       return next(
//         new AppError(
//           "The specified organization does not belong to the current tenant.",
//           400,
//         ),
//       );
//     }

//     const uploadToCloudinary = (file, folder) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder,
//             resource_type: "auto",
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result.secure_url);
//             }
//           },
//         );

//         streamifier.createReadStream(file.buffer).pipe(stream);
//       });
//     };

//     // Encrypt sensitive fields if updated
//     if (body.bank_details) {
//       body.bank_details = {
//         bank_name: body.bank_details.bank_name,
//         account_number: body.bank_details.account_number
//           ? encrypt(body.bank_details.account_number)
//           : undefined,
//         iban: body.bank_details.iban
//           ? encrypt(body.bank_details.iban)
//           : undefined,
//       };
//     }

//     // Prepare updated fields
//     const updatedData = {
//       ...body,
//     };

//     // Handle photo upload
//     if (files.photo) {
//       updatedData.photo = await uploadToCloudinary(
//         files.photo[0],
//         "employees/photos",
//       );
//     } else if (body.photo) {
//       updatedData.photo = body.photo; // Retain existing URL
//     }

//     // Handle CV upload
//     if (files.cv) {
//       updatedData.cv = await uploadToCloudinary(files.cv[0], "employees/cvs");
//     } else if (body.cv) {
//       updatedData.cv = body.cv; // Retain existing URL
//     }

//     // Handle visa copy upload
//     if (files.visa_copy) {
//       updatedData.visa_copy = await uploadToCloudinary(
//         files.visa_copy[0],
//         "employees/visa_copies",
//       );
//     } else if (body.visa_copy) {
//       updatedData.visa_copy = body.visa_copy; // Retain existing URL
//     }

//     // Handle Emirates ID upload
//     if (files.emirates_id) {
//       updatedData.emirates_id = await uploadToCloudinary(
//         files.emirates_id[0],
//         "employees/emirates_ids",
//       );
//     } else if (body.emirates_id) {
//       updatedData.emirates_id = body.emirates_id; // Retain existing URL
//     }

//     // Handle Emirates ID upload
//     if (files.passport_id) {
//       updatedData.passport_id = await uploadToCloudinary(
//         files.passport_id[0],
//         "employees/passport_ids",
//       );
//     } else if (body.passport_id) {
//       updatedData.passport_id = body.passport_id; // Retain existing URL
//     }

//     // Update employee record
//     const employee = await Employee.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         tenant_id: req.user.tenant_id._id,
//         organization_id: req.user.selectedOrganization,
//       },
//       updatedData,
//       { new: true },
//     );

//     if (!employee) {
//       return next(
//         new AppError(
//           "Employee not found or does not belong to the current tenant.",
//           404,
//         ),
//       );
//     }

//     res.status(200).json({
//       message: "Employee updated successfully.",
//       data: employee,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Delete Employee

exports.updateEmployee = async (req, res, next) => {
  try {
    const { body } = req;

    // 1. Validate tenant ownership
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return next(
        new AppError(
          "The specified organization does not belong to the current tenant.",
          400,
        ),
      );
    }

    // 2. Encrypt bank fields if provided
    if (body.bank_details) {
      body.bank_details = {
        bank_name: body.bank_details.bank_name,
        account_number: body.bank_details.account_number
          ? encrypt(body.bank_details.account_number)
          : undefined,
        iban: body.bank_details.iban
          ? encrypt(body.bank_details.iban)
          : undefined,
        salary_transfer_mode: body.bank_details.salary_transfer_mode,
      };
    }

    // 3. Prepare updated data
    const updatedData = {
      ...body,

      // All file URLs expected from frontend after S3 upload
      photo: body.photo || undefined,
      cv: body.cv || undefined,
      visa_copy: body.visa_copy || undefined,
      emirates_id: body.emirates_id || undefined,
      passport_id: body.passport_id || undefined,
    };

    // 4. Perform the update
    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatedData,
      { new: true },
    );

    if (!employee) {
      return next(
        new AppError(
          "Employee not found or does not belong to the current tenant.",
          404,
        ),
      );
    }

    res.status(200).json({
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    let employeeId = req.params.id;

    const employee = await Employee.findOneAndDelete({
      _id: employeeId,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!employee) {
      return next(new AppError("Employee not found.", 404));
    }

    // Nullify references in other collections
    if (employee) {
      await Promise.all([
        Customer.updateMany(
          { assigned_to: employeeId },
          { $set: { assigned_to: null } },
        ),
        Lead.updateMany(
          { assigned_to: employeeId },
          { $set: { assigned_to: null } },
        ),
        Task.updateMany(
          { assignedTo: employeeId },
          { $set: { assignedTo: null } },
        ),
        Vendor.updateMany(
          { assigned_to: employeeId },
          { $set: { assigned_to: null } },
        ),
        User.updateMany(
          { employee_id: employeeId },
          { $set: { employee_id: null } },
        ),
        Asset.updateMany(
          { assigned_to: employeeId },
          { $set: { assigned_to: null } },
        ),
      ]);
    }

    res.status(200).json({
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// // Get All Employees with Filtering
// exports.getAllEmployees = async (req, res, next) => {
//   try {
//     const {
//       search,
//       department,
//       job_title,
//       date_of_joining,
//       reporting_manager,
//       nationality,
//     } = req.query;
//     const { page, limit, skip } = req.pagination;

//     const filters = {
//       tenant_id: req.user.tenant_id._id,
//       organization_id: req.user.selectedOrganization,
//     };

//     // Add search filter
//     if (search) {
//       filters.$or = [
//         { full_name: { $regex: search, $options: "i" } },
//         { personal_email: { $regex: search, $options: "i" } },
//         { job_title: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Add department filter
//     if (department) {
//       filters.department = department;
//     }

//     // Add job title filter
//     if (job_title) {
//       filters.job_title = job_title;
//     }

//     // Add date of joining filter
//     if (date_of_joining) {
//       const parsedDate = new Date(date_of_joining);
//       if (!isNaN(parsedDate.getTime())) {
//         filters.date_of_joining = {
//           $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
//           $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
//         };
//       }
//     }

//     // Add reporting manager filter
//     if (reporting_manager) {
//       filters.reporting_manager = reporting_manager;
//     }

//     // Add nationality filter
//     if (nationality) {
//       filters.nationality = nationality;
//     }

//     const employees = await Employee.find(filters)
//       .populate("tenant_id", "company_name")
//       .populate("organization_id", "name")
//       .populate("reporting_manager", "full_name") // Populate reporting manager details
//       .skip(skip)
//       .limit(Number(limit))
//       .sort({ date_of_joining: -1 });

//     const totalCount = await Employee.countDocuments(filters);

//     res.status(200).json({
//       message: "Employees retrieved successfully.",
//       data: employees,
//       pagination: generatePaginationMetadata(totalCount, page, limit),
//     });
//   } catch (error) {
//     next(error);
//   }
// };
