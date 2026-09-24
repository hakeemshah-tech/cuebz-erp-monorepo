// "use client";

// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import { Modal, Button, Input, Textarea } from "rizzui";
// import { useForm, FormProvider } from "react-hook-form";
// import toast from "react-hot-toast";
// import eventCalendarService from "@/services/eventCalendarService";
// import { FiTrash } from "react-icons/fi";

// export default function EventCalendarPage() {
//   const [events, setEvents] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");

//   const methods = useForm({
//     defaultValues: { title: "", description: "" },
//   });
//   const { register, handleSubmit, reset, setValue } = methods;

//   // ✅ Fetch Events from Backend
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await eventCalendarService.getList();
//       setEvents(
//         response.data.map((event: any, index: number) => ({
//           id: event._id,
//           title: event.title,
//           description: event.description,
//           start: event.date,
//           backgroundColor: getRandomColor(index),
//         }))
//       );
//     } catch (error) {
//       toast.error("Failed to load events.");
//     }
//   };

//   // ✅ Generate Random Colors for Events
//   const getRandomColor = (index: number) => {
//     const colors = [
//       "bg-blue-500",
//       "bg-green-500",
//       "bg-yellow-500",
//       "bg-purple-500",
//       "bg-red-500",
//     ];
//     return colors[index % colors.length];
//   };

//   // ✅ Trim Long Titles to Prevent Overflow
//   const trimTitle = (title: string, maxLength = 12) => {
//     return title.length > maxLength
//       ? `${title.substring(0, maxLength)}...`
//       : title;
//   };

//   // ✅ Handle Event Click (Edit Mode)
//   const handleEventClick = (eventId: string) => {
//     const event: any = events.find((e: any) => e.id === eventId);
//     if (event) {
//       setEditingEvent(event.id);
//       setValue("title", event.title);
//       setValue("description", event.description || "");
//       setModalOpen(true);
//     }
//   };

//   // ✅ Handle Date Click (New Event)
//   const handleDateClick = (arg: any) => {
//     setEditingEvent(null);
//     reset();
//     setSelectedDate(arg.dateStr);
//     setModalOpen(true);
//   };

//   // ✅ Handle Event Drop (Drag & Drop to Reschedule)
//   const handleEventDrop = async (eventDropInfo: any) => {
//     try {
//       const updatedEvent = {
//         date: eventDropInfo.event.startStr, // New dropped date
//       };

//       await eventCalendarService.edit(eventDropInfo.event.id, updatedEvent);
//       toast.success("Event rescheduled successfully!");
//       fetchEvents();
//     } catch {
//       toast.error("Failed to update event date.");
//     }
//   };

//   // ✅ Submit Event (Create / Update)
//   const onSubmit = async (data: any) => {
//     try {
//       if (editingEvent) {
//         await eventCalendarService.edit(editingEvent, data);
//         toast.success("Event updated successfully!");
//       } else {
//         await eventCalendarService.create({ ...data, date: selectedDate });
//         toast.success("Event added successfully!");
//       }
//       fetchEvents();
//       setModalOpen(false);
//       reset();
//     } catch {
//       toast.error("Failed to save event.");
//     }
//   };

//   // ✅ Handle Delete Confirmation
//   const handleDelete = async () => {
//     try {
//       if (!editingEvent) return;
//       await eventCalendarService.delete(editingEvent);
//       toast.success("Event deleted successfully!");
//       fetchEvents();
//       setModalOpen(false);
//     } catch {
//       toast.error("Failed to delete event.");
//     }
//   };

//   return (
//     <div className="p-8 max-w-screen-xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
//         📅 Event Calendar
//       </h1>

//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           editable
//           selectable
//           droppable
//           eventDrop={handleEventDrop} // 🛠 Handle Drag & Drop
//           dateClick={handleDateClick}
//           eventClick={(eventInfo) => handleEventClick(eventInfo.event.id)}
//           height="auto"
//           eventContent={(eventInfo: any) => {
//             const event: any = events.find(
//               (e: { id: string; backgroundColor: string }) =>
//                 e.id === eventInfo.event.id
//             );
//             const eventColor = event?.backgroundColor || "bg-gray-500";
//             const trimmedTitle = trimTitle(eventInfo.event.title);

//             return (
//               <div
//                 className={`flex items-center justify-center px-3 py-2 rounded-md text-white ${eventColor} hover:shadow-lg transition duration-300 cursor-pointer`}
//                 title={eventInfo.event.title} // 🛠 Show full title on hover
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEventClick(eventInfo.event.id);
//                 }}
//               >
//                 <span className="truncate">{trimmedTitle}</span>
//               </div>
//             );
//           }}
//         />
//       </div>

//       {/* ✅ Event Modal */}
//       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
//         <div className="p-6">
//           <h3 className="text-2xl font-semibold mb-4 text-gray-900">
//             {editingEvent ? "Edit Event" : "Add Event"}
//           </h3>

//           <FormProvider {...methods}>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <Input
//                 label="Event Title"
//                 {...register("title")}
//                 required
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
//               />
//               <Textarea
//                 label="Description"
//                 {...register("description")}
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
//               />

//               <div className="flex justify-between items-center mt-6">
//                 {editingEvent && (
//                   <Button
//                     variant="outline"
//                     className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all"
//                     onClick={handleDelete}
//                   >
//                     <FiTrash className="mr-2" /> Delete Event
//                   </Button>
//                 )}

//                 <Button
//                   type="submit"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
//                 >
//                   {editingEvent ? "Update Event" : "Add Event"}
//                 </Button>
//               </div>
//             </form>
//           </FormProvider>
//         </div>
//       </Modal>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, Button, Input, Textarea } from "rizzui";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import eventCalendarService from "@/services/eventCalendarService";
import { FiTrash } from "react-icons/fi";

export default function EventCalendarPage() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const methods = useForm({
    defaultValues: { title: "", description: "" },
  });
  const { register, handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventCalendarService.getList();
      setEvents(
        response.data.map((event: any, index: number) => ({
          id: event._id,
          title: event.title,
          description: event.description,
          start: event.date,
          backgroundColor: getPrimaryColor(index),
        }))
      );
    } catch {
      toast.error("Failed to load events.");
    }
  };

  const getPrimaryColor = (index: number) => {
    const colors = [
      "bg-primary",
      "bg-primary/90",
      "bg-primary/80",
      "bg-primary/70",
      "bg-primary/60",
    ];
    return colors[index % colors.length];
  };

  const trimTitle = (title: string, maxLength = 12) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const handleEventClick = (eventId: string) => {
    const event: any = events.find((e: any) => e.id === eventId);
    if (event) {
      setEditingEvent(event.id);
      setValue("title", event.title);
      setValue("description", event.description || "");
      setModalOpen(true);
    }
  };

  const handleDateClick = (arg: any) => {
    setEditingEvent(null);
    reset();
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
  };

  const handleEventDrop = async (eventDropInfo: any) => {
    try {
      await eventCalendarService.edit(eventDropInfo.event.id, {
        date: eventDropInfo.event.startStr,
      });
      toast.success("Event rescheduled successfully!");
      fetchEvents();
    } catch {
      toast.error("Failed to update event date.");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingEvent) {
        await eventCalendarService.edit(editingEvent, data);
        toast.success("Event updated successfully!");
      } else {
        await eventCalendarService.create({ ...data, date: selectedDate });
        toast.success("Event added successfully!");
      }
      fetchEvents();
      setModalOpen(false);
      reset();
    } catch {
      toast.error("Failed to save event.");
    }
  };

  const handleDelete = async () => {
    try {
      if (!editingEvent) return;
      await eventCalendarService.delete(editingEvent);
      toast.success("Event deleted successfully!");
      fetchEvents();
      setModalOpen(false);
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl md:text-2xl font-bold mb-6 text-center text-gray-900">
        Event Calendar
      </h1>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          editable
          selectable
          droppable
          eventDrop={handleEventDrop}
          dateClick={handleDateClick}
          eventClick={(eventInfo) => handleEventClick(eventInfo.event.id)}
          height="auto"
          eventContent={(eventInfo: any) => {
            const event: any = events.find(
              (e) => (e as any)?.id === eventInfo.event.id
            );
            const eventColor = event?.backgroundColor || "bg-primary";
            const trimmedTitle = trimTitle(eventInfo.event.title);
            return (
              <div
                className={`flex items-center justify-center px-3 py-2 rounded-md text-white ${eventColor} hover:shadow-md cursor-pointer transition`}
                title={eventInfo.event.title}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(eventInfo.event.id);
                }}
              >
                <span className="truncate">{trimmedTitle}</span>
              </div>
            );
          }}
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-5 md:p-6">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
            {editingEvent ? "Edit Event" : "Add Event"}
          </h3>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Event Title"
                {...register("title")}
                required
                className="bg-white"
              />
              <Textarea
                label="Description"
                {...register("description")}
                className="bg-white"
              />
              <div className="flex justify-between items-center pt-4">
                {editingEvent && (
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleDelete}
                  >
                    <FiTrash className="mr-2" /> Delete
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {editingEvent ? "Update Event" : "Add Event"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
}
