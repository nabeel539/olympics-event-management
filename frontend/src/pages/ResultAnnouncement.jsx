import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { StoreContext } from "@/context/StoreContext";

const AnnounceResults = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/events`, {
          headers: { token },
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch events");
      }
    };
    fetchEvents();
  }, [backendUrl, token]);

  // Fetch details of the selected event
  const handleEventChange = async (eventId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/events/${eventId}`, {
        headers: { token },
      });
      const { event } = response.data;
      setSelectedEvent(event);
      setParticipants(event.participants);
      setResults([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch event details");
    }
  };

  // Handle position assignment with validation
  const handleResultChange = (athleteId, position) => {
    position = parseInt(position, 10);
    if (isNaN(position) || position <= 0) {
      toast.error("Position must be a positive number.");
      return;
    }
    if (results.some((result) => result.position === position)) {
      toast.error(
        `Position ${position} is already assigned to another participant.`
      );
      return;
    }
    setResults((prevResults) => {
      const updated = prevResults.filter(
        (result) => result.athleteId !== athleteId
      );
      updated.push({ athleteId, position });
      return updated;
    });
  };

  // Submit results
  const handleSubmit = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/events/announce`,
        { eventId: selectedEvent._id, results },
        { headers: { token } }
      );
      toast.success("Results announced successfully");
      setResults([]);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to announce results");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
        Announce Results
      </h1>

      {/* Event Selection */}
      <div className="mb-6">
        <Select onValueChange={handleEventChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event._id} value={event._id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participants List */}
      {selectedEvent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((participant) => (
            <Card
              key={participant._id}
              className="shadow-lg hover:shadow-xl transition-shadow border border-blue-300"
            >
              <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  {participant.name}
                </h2>
                <Badge variant="outline" className="mt-2">
                  {participant.country}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 bg-white">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  {participant.email}
                </p>
                <Input
                  placeholder="Position"
                  type="number"
                  min={1}
                  className="mt-4"
                  onChange={(e) =>
                    handleResultChange(participant._id, e.target.value)
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {selectedEvent && participants.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Announce Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnnounceResults;
