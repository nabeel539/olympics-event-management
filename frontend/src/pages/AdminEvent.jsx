// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { format, parse } from "date-fns";
// import { StoreContext } from "../context/StoreContext";

// const AdminEventPage = () => {
//   const { backendUrl, token } = useContext(StoreContext);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     name: "",
//     date: "",
//     venue: "",
//   });

//   // Fetch events on page load
//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/events/`, {
//         headers: { token },
//       });
//       if (response.data.success) {
//         setEvents(response.data.events);
//       } else {
//         toast.error("Failed to load events");
//       }
//     } catch (error) {
//       toast.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (token) {
//       fetchEvents();
//     }
//   }, [token]);

//   // Handle input change for the form
//   const handleInputChange = (e) => {
//     setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
//   };

//   // Handle form submission to create a new event
//   const handleCreateEvent = async () => {
//     if (!newEvent.name || !newEvent.date || !newEvent.venue) {
//       toast.error("All fields are required!");
//       return; // Exit the function if validation fails
//     }
//     try {
//       // Format the date before sending
//       const formattedDate = format(
//         parse(newEvent.date, "dd-MM-yyyy", new Date()),
//         "dd-MM-yyyy"
//       );

//       const response = await axios.post(
//         `${backendUrl}/api/events/create`,
//         {
//           ...newEvent,
//           date: formattedDate, // Ensure date is in the correct format
//         },
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success("Event created successfully!");
//         fetchEvents();

//         // setEvents([...events, response.data.event]); // Update event list
//         setNewEvent({
//           name: "",
//           date: "",
//           venue: "",
//         });
//         setShowModal(false); // Close modal
//       } else {
//         toast.error("Failed to create event");
//       }
//     } catch (error) {
//       toast.error(error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Event Management</h1>

//       {/* Show Loading Indicator */}
//       {loading ? (
//         <p>Loading events...</p>
//       ) : (
//         <div>
//           {/* Event List */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <div
//                 key={event._id}
//                 className="bg-white shadow-md rounded-lg p-4"
//               >
//                 <h2 className="text-xl font-semibold">{event.name}</h2>
//                 <p>Date: {format(new Date(event.date), "dd-MM-yyyy")}</p>
//                 <p>Venue: {event.venue}</p>
//               </div>
//             ))}
//           </div>

//           {/* Add Event Button */}
//           <button
//             className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
//             onClick={() => setShowModal(true)}
//           >
//             Add Event
//           </button>
//         </div>
//       )}

//       {/* Modal for Adding Event */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg  w-[400px]">
//             <h2 className="text-xl mb-4 font-bold">Add New Event</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-bold mb-2">Event Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={newEvent.name}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 rounded-lg p-2 w-full"
//                 placeholder="Enter event name"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-bold mb-2">Date</label>
//               <input
//                 type="text"
//                 name="date"
//                 value={newEvent.date}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 rounded-lg p-2 w-full"
//                 placeholder="Enter date (DD-MM-YYYY)"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-bold mb-2">Venue</label>
//               <input
//                 type="text"
//                 name="venue"
//                 value={newEvent.venue}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 rounded-lg p-2 w-full"
//                 placeholder="Enter venue"
//               />
//             </div>
//             <div className="flex justify-end">
//               <button
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg"
//                 onClick={handleCreateEvent}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminEventPage;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format, parse } from "date-fns";
import { StoreContext } from "../context/StoreContext";

// Import ShadCN Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminEventPage = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    venue: "",
  });

  // Fetch events on page load
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events/`, {
        headers: { token },
      });
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        toast.error("Failed to load events");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  // Handle input change for the form
  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handle form submission to create a new event
  const handleCreateEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.venue) {
      toast.error("All fields are required!");
      return; // Exit the function if validation fails
    }
    try {
      // Format the date before sending
      const formattedDate = format(
        parse(newEvent.date, "dd-MM-yyyy", new Date()),
        "dd-MM-yyyy"
      );

      const response = await axios.post(
        `${backendUrl}/api/events/create`,
        {
          ...newEvent,
          date: formattedDate, // Ensure date is in the correct format
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Event created successfully!");
        fetchEvents();

        // Reset form and close modal
        setNewEvent({
          name: "",
          date: "",
          venue: "",
        });
        setShowModal(false);
      } else {
        toast.error("Failed to create event");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>

      {/* Show Loading Indicator */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div>
          {/* Event List */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p>Date: {format(new Date(event.date), "dd-MM-yyyy")}</p>
                <p>Venue: {event.venue}</p>
              </div>
            ))}
          </div>

          {/* Add Event Button */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg">
                Add Event
              </button>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details of the event below.
                </DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter event name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Date</label>
                <input
                  type="text"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter date (DD-MM-YYYY)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={newEvent.venue}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter venue"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleCreateEvent}
                >
                  Submit
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminEventPage;
