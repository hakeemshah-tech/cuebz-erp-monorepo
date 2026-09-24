const Task = require("../models/TaskManagement.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const sendEmail = require("../utils/sendEmail");
const Employee = require("../models/Employee.schema");

// // Utility function to upload files to Cloudinary
// const uploadToCloudinary = (file, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: "auto",
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       },
//     );

//     streamifier.createReadStream(file.buffer).pipe(stream);
//   });
// };

// exports.createTask = async (req, res, next) => {
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

//     const taskData = {
//       ...body,
//       tenant_id: req.user.tenant_id._id,
//       organization_id: req.user.selectedOrganization,
//       createdBy: req.user._id,
//     };

//     // Handle file uploads for attachments
//     if (files && files.attachments) {
//       taskData.attachments = await Promise.all(
//         files.attachments.map((file) =>
//           uploadToCloudinary(file, "tasks/attachments"),
//         ),
//       );
//     }

//     // Create task record
//     const task = await Task.create(taskData);

//     // Send email notification to assigned employee
//     if (task.assignedTo) {
//       const employee = await Employee.findById(task.assignedTo);

//       if (employee && employee.personal_email) {
//         const mailOptions = {
//           from: process.env.EMAIL,
//           to: employee.personal_email,
//           subject: "New Task Assigned",
//           html: `
//             <p>Hi ${employee.full_name},</p>
//             <p>A new task has been assigned to you:</p>
//             <h3>${task.title}</h3>
//             <p>Description: ${task.description}</p>
//             <p>Priority: ${task.priority}</p>
//             <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
//             <p>Status: ${task.status}</p>
//             <p>Comments: ${task.comments || "N/A"}</p>
//           `,
//         };

//         await sendEmail(mailOptions);
//       }
//     }

//     res.status(201).json({
//       message: "Task created successfully.",
//       data: task,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

exports.createTask = async (req, res, next) => {
  try {
    const { body, files } = req;

    // Debug: Log incoming request data
    console.log("Request Body:", body);
    console.log("Files:", files);

    // Validate organization belongs to the tenant
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

    // Construct task data
    const taskData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      createdBy: req.user._id,
    };

    console.log(files, "jeejeje");

    // Handle attachments upload
    if (
      files &&
      files["attachments[]"] &&
      Array.isArray(files["attachments[]"])
    ) {
      console.log("Uploading attachments...");
      taskData.attachments = await Promise.all(
        files["attachments[]"].map((file) =>
          uploadToCloudinary(file, "tasks/attachments"),
        ),
      );
    }

    // Create task in the database
    const task = await Task.create(taskData);
    console.log("Task created:", task);

    // Send email to the assigned employee
    if (task.assignedTo) {
      const employee = await Employee.findById(task.assignedTo);

      if (employee && employee.personal_email) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: employee.personal_email,
          subject: "New Task Assigned",
          html: `
            <p>Hi ${employee.full_name},</p>
            <p>A new task has been assigned to you:</p>
            <h3>${task.title}</h3>
            <p>Description: ${task.description}</p>
            <p>Priority: ${task.priority}</p>
            <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: ${task.status}</p>
            <p>Comments: ${task.comments || "N/A"}</p>
          `,
        };

        await sendEmail(mailOptions);
        console.log(`Email sent to ${employee.personal_email}`);
      }
    }

    res.status(201).json({
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    next(error);
  }
};

// Get All Tasks with Filtering
exports.getAllTasks = async (req, res, next) => {
  try {
    const { search, assignedTo, priority, status, dueDate, createdBy } =
      req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Add search filter
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add assignedTo filter
    if (assignedTo) {
      filters.assignedTo = assignedTo;
    }

    // Add priority filter
    if (priority) {
      filters.priority = priority;
    }

    // Add status filter
    if (status) {
      filters.status = status;
    }

    // Add dueDate filter
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (!isNaN(parsedDate.getTime())) {
        filters.dueDate = {
          $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
          $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
        };
      }
    }

    // Add createdBy filter
    if (createdBy) {
      filters.createdBy = createdBy;
    }

    const tasks = await Task.find(filters)
      .populate("assignedTo", "full_name email")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ dueDate: 1 });

    const totalCount = await Task.countDocuments(filters);

    res.status(200).json({
      message: "Tasks retrieved successfully.",
      data: tasks,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get Task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    })
      .populate("assignedTo", "full_name email")
      .populate("createdBy", "name email");

    if (!task) {
      return next(new AppError("Task not found.", 404));
    }

    res.status(200).json({
      message: "Task retrieved successfully.",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Update Task
exports.updateTask = async (req, res, next) => {
  try {
    const { body, files } = req;

    console.log(body, "reall");

    // Check if the organization belongs to the current user's tenant
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

    // const updatedData = {
    //   ...body,
    // };

    // Upload new files and get URLs
    // const newAttachments =
    //   files && files["attachments[]"]
    //     ? await Promise.all(
    //         files["attachments[]"].map((file) =>
    //           uploadToCloudinary(file, "tasks/attachments"),
    //         ),
    //       )
    //     : [];

    // Combine existing and new attachments
    // updatedData.attachments = [...body["attachments"], ...newAttachments];

    // Handle new attachments
    const newAttachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map((file) =>
              uploadToCloudinary(file, "cheque-tracker/attachments"),
            ),
          )
        : [];

    // Merge attachments
    const mergedAttachments = [
      ...(body["attachments"] || []),
      ...newAttachments,
    ];

    const { dueDate, ...rest } = body; // Destructure to exclude reminder_date

    const updatePipeline = [
      {
        $set: {
          ...rest, // everything except reminder_date
          attachments: mergedAttachments,
        },
      },
      {
        $set: {
          dueDate: new Date(body.dueDate),
          reminder_status: {
            $cond: [
              { $ne: ["$dueDate", new Date(dueDate)] },
              "pending",
              "$reminder_status",
            ],
          },
        },
      },
    ];

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatePipeline,
      { new: true },
    );

    if (!task) {
      return next(
        new AppError(
          "Task not found or does not belong to the current tenant.",
          404,
        ),
      );
    }

    // Send email notification to the updated assigned employee
    if (task.assignedTo) {
      const employee = await Employee.findById(task.assignedTo);

      if (employee && employee.personal_email) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: employee.personal_email,
          subject: "Task Updated",
          html: `
            <p>Hi ${employee.full_name},</p>
            <p>The following task assigned to you has been updated:</p>
            <h3>${task.title}</h3>
            <p>Description: ${task.description}</p>
            <p>Priority: ${task.priority}</p>
            <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: ${task.status}</p>
            <p>Comments: ${task.comments || "N/A"}</p>
          `,
        };

        await sendEmail(mailOptions);
      }
    }

    res.status(200).json({
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!task) {
      return next(new AppError("Task not found.", 404));
    }

    res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
