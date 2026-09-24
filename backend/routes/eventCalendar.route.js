const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const eventCalendarController = require("../controllers/eventCalendar.controller");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const MODULES = require("../constants/module");
const {
  createEventValidation,
  updateEventValidation,
} = require("../validations/eventCalendar.validator");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// ✅ Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.eventCalendar),
  checkTenantVerified,
);

// ✅ Create Event
router.post(
  "/tenant",
  validateRequest(createEventValidation, true),
  eventCalendarController.createEvent,
);

// ✅ Get All Events
router.get("/tenant", eventCalendarController.getEvents);

// ✅ Get Event by ID
router.get("/:id/tenant", eventCalendarController.getEventById);

// ✅ Update Event
router.put(
  "/:id/tenant",
  validateRequest(updateEventValidation, true),
  eventCalendarController.updateEvent,
);

// ✅ Delete Event
router.delete("/:id/tenant", eventCalendarController.deleteEvent);

module.exports = router;
