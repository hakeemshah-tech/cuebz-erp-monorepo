const Visitor = require("../models/Visitor.schema");
const AppError = require("../utils/appError");
const Organization = require("../models/Organization.schema"); // Import Organization model
const { generatePaginationMetadata } = require("../utils/usefulFunctions");

// Create Visitor
exports.createVisitor = async (req, res, next) => {
  try {
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

    // Create visitor record
    const visitor = await Visitor.create({
      ...req.body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    res.status(201).json({
      message: "Visitor created successfully.",
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllVisitors = async (req, res, next) => {
  try {
    const { search, visitor_type, status, date } = req.query;

    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Add search filter
    if (search) {
      filters.$or = [
        { visitor_name: { $regex: search, $options: "i" } },
        { visitor_company: { $regex: search, $options: "i" } },
        { purpose_of_visit: { $regex: search, $options: "i" } },
      ];
    }

    // Add visitor_type filter
    if (visitor_type) {
      filters.visitor_type = visitor_type;
    }

    // Add status filter
    if (status) {
      filters.status = status;
    }

    // Add date filter
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        filters.date = {
          $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
          $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
        };
      }
    }

    // Fetch visitors
    const visitors = await Visitor.find(filters)
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    // Populate person_visiting dynamically
    // for (const visitor of visitors) {
    //   if (visitor.person_visiting && visitor.person_visiting_model) {
    //     await visitor.populate({
    //       path: "person_visiting",
    //       model: visitor.person_visiting_model,
    //     });
    //   }
    // }

    const totalCount = await Visitor.countDocuments(filters);

    res.status(200).json({
      message: "Visitors retrieved successfully.",
      data: visitors,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get Visitor by ID
exports.getVisitorById = async (req, res, next) => {
  try {
    const visitor = await Visitor.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id");

    if (!visitor) {
      return next(new AppError("Visitor not found.", 404));
    }

    // Populate person_visiting dynamically
    // if (visitor.person_visiting && visitor.person_visiting_model) {
    //   await visitor.populate({
    //     path: "person_visiting",
    //     model: visitor.person_visiting_model,
    //   });
    // }

    res.status(200).json({
      message: "Visitor retrieved successfully.",
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

// Update Visitor
exports.updateVisitor = async (req, res, next) => {
  try {
    // const { organization_id } = req.body;
    const { reminder_action_date, ...rest } = req.body;

    // Check if the organization belongs to the current user's tenant
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return new AppError(
        "The specified organization does not belong to the current tenant.",
        400,
      );
    }

    const filter = {
      _id: req.params.id,
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

    // Update visitor record
    const visitor = await Visitor.findOneAndUpdate(filter, update, opts);

    if (!visitor) {
      return new AppError(
        "Visitor not found or does not belong to the current tenant.",
        404,
      );
    }

    res.status(200).json({
      message: "Visitor updated successfully.",
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Visitor
exports.deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!visitor) {
      return next(new AppError("Visitor not found.", 404));
    }

    res.status(200).json({
      message: "Visitor deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
