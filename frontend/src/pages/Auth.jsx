import { useState } from "react";
import AdminLogin from "../widgets/Auth/AdminLogin";
import AthleteAuthForm from "../widgets/Auth/AthleteAuthForm"; // This will handle both login and signup for Athlete
import { assets } from "../assets/assets";

const Auth = () => {
  const [isAdmin, setIsAdmin] = useState(true); // Toggle state for admin/athlete

  // Function to handle toggle
  const handleToggle = () => {
    setIsAdmin(!isAdmin); // Switch between admin and athlete
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 relative">
      {/* Title */}
      <p className="bg-white/25 px-3 py-2 text-xl lg:text-3xl absolute font-bold rounded-md border border-white/70 left-32 top-16 lg:left-[4%] lg:top-7">
        Olympics Event Management System
      </p>
      {/* Image Section */}
      <div className="lg:basis-1/2 hidden lg:block ">
        <img
          src={assets.slide5}
          className="h-full w-full object-cover"
          alt="Background"
        />
      </div>
      {/* Form Section */}
      <div className="lg:basis-1/2 flex justify-center items-center bg-[#0f172a] h-full">
        <div className="w-full max-w-md px-6 py-8 shadow-lg rounded-md bg-white">
          {/* Toggle Button */}
          <div className="flex justify-center mb-6">
            <div
              className="flex bg-gradient-to-br from-[#c4d0e2] to-[#e9f7ff] shadow-[20px_20px_60px_#b9c4d5,-20px_-20px_60px_#fbffff] rounded-full p-1 cursor-pointer w-full max-w-[200px]"
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
          {/* Conditional Form Rendering */}
          {isAdmin ? <AdminLogin /> : <AthleteAuthForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
