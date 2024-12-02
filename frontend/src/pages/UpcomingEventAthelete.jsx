/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UpcomingEventAthlete = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events`);
      if (response.data.success) {
        setEvents(response.data.events);
        setFilteredEvents(response.data.events); // Initialize filtered events
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

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to the first page when search query changes
  }, [searchQuery, events]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleRegisterForEvent = async (eventId) => {
    const confirm = window.confirm("Do you want to register for this event?");
    if (!confirm) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/events/register`,
        { eventId },
        {
          headers: {
            token: token,
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
    }
  };

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 justify-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#d7c378]">
        Upcoming Events
      </h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search Events..."
          className="p-2 w-1/2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7c378]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Events List */}
      <div className="flex flex-wrap gap-6 justify-center">
        {currentEvents.map((event) => (
          <div
            key={event._id}
            className="w-80 p-4 bg-white shadow-lg rounded-lg text-sm"
          >
            <img
              src={assets.slide6}
              alt="Event Banner"
              className="rounded-lg mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-500 mb-1">
              <strong>Date:</strong> {new Date(event.date).toDateString()}
            </p>
            <p className="text-gray-500 mb-3">
              <strong>Venue:</strong> {event.venue}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-grow"
                onClick={() => handleViewDetails(event)}
              >
                View Details
              </Button>
              <Button
                variant="default"
                className="flex-grow"
                onClick={() => handleRegisterForEvent(event._id)}
              >
                Register +
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        {Array.from({
          length: Math.ceil(filteredEvents.length / eventsPerPage),
        }).map((_, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => paginate(index + 1)}
            className={`w-10 h-10 ${
              currentPage === index + 1 ? "bg-[#0f172a] text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Dialog for event details */}
      {selectedEvent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent.name}</DialogTitle>
              <DialogDescription>
                <img
                  src={assets.banner}
                  alt="Event Banner"
                  className="w-full rounded-lg mb-4"
                />
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedEvent.date).toDateString()}
                </p>
                <p>
                  <strong>Venue:</strong> {selectedEvent.venue}
                </p>
                <p>
                  <strong>Participants:</strong>{" "}
                  {selectedEvent.participants.length || "N/A"}
                </p>
                <p>
                  <strong>Results:</strong>{" "}
                  {selectedEvent.results.length || "N/A"}
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleCloseDialog} variant="secondary">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UpcomingEventAthlete;
