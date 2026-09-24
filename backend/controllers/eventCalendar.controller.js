const EventCalendar = require("../models/eventCalendar.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");

// ✅ Create Event
exports.createEvent = async (req, res, next) => {
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

    const newEvent = await EventCalendar.create({
      ...req.body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization, // Ensure organization ID is set
    });

    res.status(201).json({
      message: "Event created successfully.",
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Event
exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedEvent = await EventCalendar.findOneAndUpdate(
      {
        _id: id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      req.body,
      { new: true },
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({
      message: "Event updated successfully.",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Events (Without Pagination)
exports.getEvents = async (req, res, next) => {
  try {
    const { search, date } = req.query;

    const filters = {
      tenant_id: req.user.tenant_id,
      organization_id: req.user.selectedOrganization,
    };

    // Search filter
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Date filter
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        filters.date = {
          $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
          $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
        };
      }
    }

    const events = await EventCalendar.find(filters)
      .sort({ date: -1 }) // Sort by latest event date
      .populate("organization_id", "name")
      .exec();

    res.status(200).json({
      message: "Events retrieved successfully.",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Event by ID
exports.getEventById = async (req, res, next) => {
  try {
    const event = await EventCalendar.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id");

    if (!event) {
      return next(new AppError("Event not found.", 404));
    }

    res.status(200).json({
      message: "Event retrieved successfully.",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete Event
exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedEvent = await EventCalendar.findOneAndDelete({
      _id: id,
      tenant_id: req.user.tenant_id,
    });

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
