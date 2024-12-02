// export default AdminDashboard;
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Collapse } from "react-collapse"; // For collapsible sections
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";

const AdminDashboard = () => {
  const { backendUrl, token, setToken } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null); // Track which event is expanded
  const [athletes, setAthletes] = useState({}); // Store athlete info
  // Fetch all athletes to map name and country
  const fetchAthletes = async () => {
    // alert("my Token", token);

    try {
      // Ensure the token is properly passed
      const response = await axios.get(`${backendUrl}/api/athletes/all`, {
        headers: {
          token: token, // Ensure token format
        },
      });

      // Handle the athlete data and map by ID
      const athleteMap = {};
      response.data.data.forEach((athlete) => {
        athleteMap[athlete._id] = {
          name: athlete.name,
          country: athlete.country,
        };
      });

      setAthletes(athleteMap); // Store athletes by ID for quick lookup
    } catch (error) {
      // Log and handle authorization error
      if (error.response && error.response.status === 401) {
        console.error(
          "Authorization error: Not authorized, please login again."
        );
      } else {
        console.error("Error fetching athletes", error);
      }
    }
  };

  // Fetch events and athlete data
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events/`);
      setEvents(response.data.events); // Assuming events are inside 'data.events'
      await fetchAthletes(); // Fetch athlete details
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      fetchEvents();
    } else {
      toast.error("Error...");
    }
  }, []);

  // Toggle expanded state for each event
  const toggleEvent = (id) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  // Render collapsible cards and updated content
  return (
    <div className="mb-5 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Event Performance Details
      </h1>
      <div className="container mx-auto mt-10 grid grid-cols-3 gap-3 p-4 text-sm">
        {events.length > 0 ? (
          events.map((event) => {
            const hasResults = event.results.length > 0; // Check for results availability
            return (
              <div
                key={event._id}
                className={`border rounded-lg p-4 mb-5 shadow-md ${
                  hasResults ? "bg-green-100" : "bg-gray-100" // Change colors here
                }`}
              >
                <div className="flex justify-between items-center">
                  {/* Event basic details */}
                  <div>
                    <h2 className="text-xl font-semibold">{event.name}</h2>
                    <p className="text-gray-600">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Venue: {event.venue}</p>
                  </div>

                  {/* Toggle button */}
                  <button
                    className="text-blue-500 underline"
                    onClick={() => toggleEvent(event._id)}
                  >
                    {expandedEventId === event._id ? (
                      <IoIosArrowDropdown size={30} />
                    ) : (
                      <IoIosArrowDropup size={30} />
                    )}
                  </button>
                </div>

                {/* Collapsible section for additional details */}
                <Collapse isOpened={expandedEventId === event._id}>
                  <div className="mt-4 text-xs">
                    {/* Show participants */}
                    <h3 className="font-medium">Participants:</h3>
                    {event.participants.length > 0 ? (
                      <ul className="pl-5 text-sm list-disc">
                        {event.participants.map((participantId) => (
                          <li key={participantId} className="text-gray-800">
                            {athletes[participantId]?.name || "Unknown Athlete"}{" "}
                            (
                            {athletes[participantId]?.country ||
                              "Unknown Country"}
                            )
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No participants for this event
                      </p>
                    )}

                    {/* Show results in plain text */}
                    {event.results.length > 0 ? (
                      <div className="mt-6">
                        <h3 className="font-medium">Results (Performance):</h3>
                        <ul className="text-sm p-2">
                          {event.results.map((result, index) => {
                            // Determine the place (1st, 2nd, 3rd) for the image
                            const placeImage =
                              index === 0
                                ? `${assets.gold}`
                                : index === 1
                                ? `${assets.silver}`
                                : index === 2
                                ? `${assets.bronze}`
                                : null;
                            return (
                              <li
                                key={result.athleteId}
                                className="text-gray-800 flex items-center p-2 bg-gray-50/50 border-b-0 border-gray-400 rounded-sm m-1"
                              >
                                {placeImage && (
                                  <img
                                    src={placeImage}
                                    alt={`${index + 1} place`}
                                    className="w-5 h-5 mr-2"
                                  />
                                )}
                                {`${index + 1}st place: ${
                                  athletes[result.athleteId]?.name ||
                                  "Unknown Athlete"
                                } (${
                                  athletes[result.athleteId]?.country ||
                                  "Unknown Country"
                                })`}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">
                        Results not available yet
                      </p>
                    )}
                  </div>
                </Collapse>
              </div>
            );
          })
        ) : (
          <p>Loading events...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
