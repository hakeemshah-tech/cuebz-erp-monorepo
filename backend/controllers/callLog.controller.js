const CallLog = require("../models/CallLog.schema");
const organizationSchema = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");

exports.createCallLog = async (req, res, next) => {
  try {
    // Check if the organization belongs to the current user's tenant
    const organization = await organizationSchema.findOne({
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

    const newCallLog = await CallLog.create({
      ...req.body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization, // Ensure organization ID is set
    });

    res.status(201).json({
      message: "Call Log created successfully.",
      data: newCallLog,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCallLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Split the body so we can treat reminder_action_date specially
    const { reminder_action_date, ...rest } = req.body;

    const filter = {
      _id: id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    /**
     * Build the update.
     * ─ If reminder_action_date is present ⇒ use aggregation‑pipeline form
     *   so we can compare old vs. new and set reminder_status conditionally.
     * ─ Otherwise use a normal $set update (cheaper).
     */

    let update;

    if (reminder_action_date !== undefined) {
      // Aggregation‑pipeline update ⇒ single round‑trip
      update = [
        // 1) set every other field from the request
        { $set: rest },
        // 2) set the (possibly new) reminder date
        //    AND compute reminder_status only when the date really changed
        {
          $set: {
            reminder_action_date: new Date(reminder_action_date),
            reminder_status: {
              $cond: [
                {
                  $ne: [
                    "$reminder_action_date",
                    new Date(reminder_action_date),
                  ],
                },
                "pending", // value to write when changed
                "$reminder_status", // keep old value
              ],
            },
          },
        },
      ];
    } else {
      // No reminder date: simple update object
      update = { $set: rest };
    }

    const opts = { new: true, returnDocument: "after" }; // return updated doc

    // const updatedCallLog = await CallLog.findOneAndUpdate(
    //   {
    //     _id: id,
    //     tenant_id: req.user.tenant_id._id,
    //     organization_id: req.user.selectedOrganization,
    //   },
    //   req.body,
    //   { new: true },
    // );

    const updatedCallLog = await CallLog.findOneAndUpdate(filter, update, opts);

    if (!updatedCallLog) {
      return res.status(404).json({ message: "Call Log not found." });
    }

    res.status(200).json({
      message: "Call Log updated successfully.",
      data: updatedCallLog,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCallLogs = async (req, res, next) => {
  try {
    const { search, visitor_type, dateTime, status } = req.query;

    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id,
      organization_id: req.user.selectedOrganization,
    };

    // Search filter
    if (search) {
      filters.$or = [
        { caller_name: { $regex: search, $options: "i" } },
        { caller_company: { $regex: search, $options: "i" } },
        { purpose_of_call: { $regex: search, $options: "i" } },
      ];
    }

    // Visitor type filter
    if (visitor_type) filters.visitor_type = visitor_type;
    if (status) filters.status = status;

    // Date filter
    if (dateTime) {
      const parsedDate = new Date(dateTime);
      if (!isNaN(parsedDate.getTime())) {
        filters.dateTime = {
          $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
          $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
        };
      }
    }

    const callLogs = await CallLog.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ date_time: -1 })
      .populate("organization_id", "name")
      .exec();

    const totalCount = await CallLog.countDocuments(filters);

    res.status(200).json({
      message: "Call Logs retrieved successfully.",
      data: callLogs,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get Call Log by ID
exports.getCallLogById = async (req, res, next) => {
  try {
    const callLog = await CallLog.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id");

    if (!callLog) {
      return next(new AppError("Call Log not found.", 404));
    }

    res.status(200).json({
      message: "Call Log retrieved successfully.",
      data: callLog,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCallLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCallLog = await CallLog.findOneAndDelete({
      _id: id,
      tenant_id: req.user.tenant_id,
    });

    if (!deletedCallLog) {
      return res.status(404).json({ message: "Call Log not found." });
    }

    res.status(200).json({
      message: "Call Log deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
