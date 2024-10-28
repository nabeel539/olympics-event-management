import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { format, parse } from "date-fns";
import { toast } from "react-toastify";

const AtheleteProfile = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    country: "",
    address: "",
    dob: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch athlete profile from the API on page load
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/athletes/profile`, {
        headers: { token: token }, // Assuming token is stored in localStorage
      });
      if (response.data.success) {
        // Format DOB to DD-MM-YYYY format for display
        const formattedProfile = {
          ...response.data.athlete,
          dob: response.data.athlete.dob
            ? format(new Date(response.data.athlete.dob), "dd-MM-yyyy")
            : "",
        };
        setProfile(formattedProfile);
      } else {
        setError("Failed to fetch profile.");
      }
    } catch (err) {
      setError("Error fetching profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle profile update submission
  const handleUpdate = async () => {
    try {
      // Parse the DOB back to DD-MM-YYYY format before sending to the API
      const formattedDob = format(
        parse(profile.dob, "dd-MM-yyyy", new Date()),
        "dd-MM-yyyy"
      );

      const updatedProfile = {
        ...profile,
        dob: formattedDob, // Ensure DOB is in the correct format
      };

      const response = await axios.put(
        `${backendUrl}/api/athletes/profile`,
        updatedProfile, // Send the updated profile with formatted DOB
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      setError("Error updating profile: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Profile Information
        </h2>
        <div className="space-y-4 text-[12px]">
          <div>
            <label className="block text-gray-600">Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-gray-800">{profile.name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-gray-800">{profile.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600">Country:</label>
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-gray-800">{profile.country}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600">Address:</label>
            {isEditing ? (
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-gray-800">{profile.address}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600">Date of Birth:</label>
            {isEditing ? (
              <input
                type="text"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-gray-800">
                {profile.dob ? format(new Date(profile.dob), "dd-MM-yyyy") : ""}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-600">Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-gray-800">{profile.phone}</p>
            )}
          </div>
          <div className="flex justify-between mt-4">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtheleteProfile;
