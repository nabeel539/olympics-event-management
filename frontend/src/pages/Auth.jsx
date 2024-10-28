import { useState } from "react";
import AdminLogin from "../components/Auth/AdminLogin";
import AthleteAuthForm from "../components/Auth/AthleteAuthForm"; // This will handle both login and signup for Athlete
import { assets } from "../assets/assets";

const Auth = () => {
  const [isAdmin, setIsAdmin] = useState(true); // Toggle state for admin/athlete

  // Function to handle toggle
  const handleToggle = () => {
    setIsAdmin(!isAdmin); // Switch between admin and athlete
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <p className="bg-white/25 px-3 py-2 text-3xl absolute font-bold rounded-md border border-white/70 left-[4%] top-7">
        Olympics Event Management System
      </p>
      {/* <div className="flex flex-col bg-white rounded-md p-6"> */}
      {/* Form Display */}
      <div>
        <img src={assets.slide5} className="h-[100%] object-cover basis-1/2" />
      </div>
      <div className="basis-1/2 flex justify-center items-center">
        <div className="w-96 bg-[#c4d0e2] shadow-lg p-8 rounded-md ">
          {/* Toggle Button */}
          <div className="flex justify-center mb-6">
            <div
              className="flex bg-gradient-to-br from-[#c4d0e2] to-[#e9f7ff] shadow-[20px_20px_60px_#b9c4d5,-20px_-20px_60px_#fbffff] rounded-full p-1 cursor-pointer w-52"
              onClick={handleToggle}
            >
              <div
                className={`flex items-center justify-center w-1/2 py-2 text-sm font-medium text-white bg-[#0a0b0b] rounded-full transition-transform transform ${
                  isAdmin ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {isAdmin ? "Admin" : "Athlete"}
              </div>
            </div>
          </div>
          {isAdmin ? <AdminLogin /> : <AthleteAuthForm />}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Auth;
