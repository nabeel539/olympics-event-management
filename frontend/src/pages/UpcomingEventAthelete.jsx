/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

// Dialog Component for showing event details
const EventDetailDialog = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-xs">
        <img src={assets.banner} alt="banner" className="w-full rounded-lg" />
        <h2 className="text-2xl font-bold mb-4 mt-2">{event.name}</h2>
        <p>
          <strong>Date:</strong> {new Date(event.date).toDateString()}
        </p>
        <p>
          <strong>Venue:</strong> {event.venue}
        </p>
        <p>
          <strong>Participants:</strong> {event.participants.length || "N/A"}
        </p>
        <p>
          <strong>Results:</strong> {event.results.length || "N/A"}
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const UpcomingEventAthelete = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events`); // API URL
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Function to handle registration for an event
  const handleRegisterForEvent = async (eventId) => {
    const confirm = window.confirm("Do you want to register for this event?");
    if (!confirm) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/events/register`, // Replace with your actual endpoint
        { eventId },
        {
          headers: {
            token: token, // Assuming JWT is stored in local storage
          },
        }
      );

      if (response.data.success) {
        toast.success("Registered successfully!");
        fetchEvents();
      } else {
        toast.error("Already registered for this event");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Already registered for this event");
      //   alert(error.message);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {events.map((event) => (
        <div
          key={event._id}
          className="w-80 p-4 bg-white shadow-md rounded-lg text-xs"
        >
          <img src={assets.slide6} alt="banner" className="rounded-md" />
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p className="text-gray-500">
            Date: {new Date(event.date).toDateString()}
          </p>
          <p className="text-gray-500">Venue: {event.venue}</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails(event)}
              className="flex-grow-[3] mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              View Details
            </button>
            <button
              onClick={() => handleRegisterForEvent(event._id)}
              className="flex-grow mt-2 w-full bg-green-700 text-white py-2  rounded-md hover:bg-green-800 flex items-center justify-center"
            >
              Register +
            </button>
          </div>
        </div>
      ))}

      {/* Dialog Component to show event details */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default UpcomingEventAthelete;
