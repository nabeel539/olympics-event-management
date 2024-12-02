import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const ParticipationHistory = () => {
  const { backendUrl, token, setToken } = useContext(StoreContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch participation history on page load
  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/athletes/participation-history`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        setHistory(response.data.participationHistory);
      } else {
        setError("Failed to load participation history");
      }
    } catch (err) {
      setError("An error occurred while fetching history: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel event registration API call
  const handleCancelRegistration = async (eventId) => {
    const confirm = window.confirm("Do you want to Cancel Participation?");
    if (!confirm) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/events/cancel`,
        { eventId },
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        toast.success("Registration canceled successfully.");
        // Update the history by filtering out the canceled event
        setHistory((prevHistory) =>
          prevHistory.filter((item) => item.eventId._id !== eventId)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        "An error occurred while canceling registration: " + error.message
      );
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      fetchHistory();
    }
  }, [token]);

  if (loading) {
    return <div className="text-center text-d7c378">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-0f172a min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#d7c378]">
        Participation History
      </h2>
      <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex-1 min-w-[300px] max-w-[calc(50%-1rem)]"
          >
            <Accordion type="single" collapsible>
              <AccordionItem
                value={item._id}
                className="bg-[#0f172a] border border-[#808080] rounded-lg overflow-hidden shadow-md"
              >
                <AccordionTrigger className="text-[#d7c378] text-lg font-medium px-4 py-2 hover:bg-[#d7c378/10] rounded-t-lg">
                  {item.eventId.name} -{" "}
                  {new Date(item.eventId.date).toLocaleDateString()}
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-gray-800 rounded-b-lg">
                  <Card className="shadow-md border border-gray-600">
                    <CardHeader className="pb-2">
                      <h3 className="text-xl font-bold text-d7c378">
                        {item.eventId.name}
                      </h3>
                      <p className="text-[#808080]">
                        <strong>Venue:</strong> {item.eventId.venue}
                      </p>
                      <p className="text-[#808080]">
                        <strong>Date:</strong>{" "}
                        {new Date(item.eventId.date).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {item.eventId.results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {item.eventId.results.map((result, index) => {
                            const place =
                              index === 0
                                ? "1st Place"
                                : index === 1
                                ? "2nd Place"
                                : index === 2
                                ? "3rd Place"
                                : "Participant";

                            const bgColor =
                              index === 0
                                ? "bg-yellow-400"
                                : index === 1
                                ? "bg-gray-300"
                                : index === 2
                                ? "bg-orange-400"
                                : "bg-gray-700";

                            return (
                              <div
                                key={index}
                                className={`${bgColor} text-white p-2 rounded-md shadow-md text-center`}
                              >
                                <p className="font-bold">{place}</p>
                                <p>{result.athleteId.name}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[#d7c378]">
                          No results available yet.
                        </p>
                      )}
                    </CardContent>
                    {item.eventId.results.length === 0 && (
                      <CardFooter className="mt-4">
                        <button
                          onClick={() =>
                            handleCancelRegistration(item.eventId._id)
                          }
                          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        >
                          Cancel Registration
                        </button>
                      </CardFooter>
                    )}
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipationHistory;
