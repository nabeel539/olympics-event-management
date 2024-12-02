import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { format, parse } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200">
        <CardHeader className="text-center bg-[#d7c378] text-[#0f172a] rounded-t-md py-4">
          <CardTitle className="text-2xl">Athlete Profile</CardTitle>
          <CardDescription className="text-[12px] mt-1 text-[#0f172ac2]">
            Manage your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[
            { label: "Name", name: "name", value: profile.name },
            { label: "Email", name: "email", value: profile.email },
            { label: "Country", name: "country", value: profile.country },
            {
              label: "Address",
              name: "address",
              value: profile.address,
              isTextArea: true,
            },
            { label: "Date of Birth", name: "dob", value: profile.dob },
            { label: "Phone", name: "phone", value: profile.phone },
          ].map(({ label, name, value, isTextArea }) => (
            <div key={name}>
              <label className="block text-gray-600 font-medium">
                {label}:
              </label>
              {isEditing ? (
                isTextArea ? (
                  <Textarea
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                ) : (
                  <Input
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                )
              ) : (
                <p className="text-gray-800 bg-gray-100 p-2 rounded">
                  {value || "N/A"}
                </p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-100 py-4 px-6 rounded-b-md">
          {isEditing ? (
            <>
              <Button
                variant="success"
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className="bg-[#0f172a] hover:bg-[#21325b] text-white"
            >
              Edit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AtheleteProfile;
