import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
// import { assets } from "../assets/assets";

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
      setError("An error occurred while fetching history." + err);
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
        {
          eventId,
        },
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
      toast.error("An error occurred while canceling registration." + error);
    }
  };
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      fetchHistory();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Participation History</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2">{item.eventId.name}</h3>
            <p className="text-gray-600">
              <strong>Date:</strong>{" "}
              {new Date(item.eventId.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>Venue:</strong> {item.eventId.venue}
            </p>

            {item.eventId.results.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Results:</h4>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {item.eventId.results.map((result, index) => {
                    const place =
                      index === 0
                        ? "1st Place"
                        : index === 1
                        ? "2nd Place"
                        : index === 2
                        ? "3rd Place"
                        : null;

                    const bgColor =
                      index === 0
                        ? "bg-yellow-400"
                        : index === 1
                        ? "bg-gray-300"
                        : index === 2
                        ? "bg-orange-400"
                        : "bg-gray-200";

                    return (
                      <div
                        key={index}
                        className={`${bgColor} text-white p-2 rounded-md shadow-md`}
                      >
                        <p className="font-bold">{place || "Participant"}</p>
                        <p>{result.athleteId.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Show Cancel button if there are no results */}
            {item.eventId.results.length === 0 && (
              <button
                onClick={() => handleCancelRegistration(item.eventId._id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Cancel Registration
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipationHistory;
