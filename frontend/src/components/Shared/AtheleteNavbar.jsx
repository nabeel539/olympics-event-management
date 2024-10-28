import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const AtheleteNavbar = () => {
  const { token, setToken, setIsAdmin } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/");
    toast.success("Logged Out.");
  };
  return (
    <div className="flex items-center justify-between font-medium bg-slate-900 shadow-md px-3 py-5">
      <NavLink to="/athelete-dashboard">
        <h2 className="text-2xl font-semibold text-white">Athelete</h2>
      </NavLink>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/events" className="flex flex-col items-center gap-1">
          <p>Events</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/history" className="flex flex-col items-center gap-1">
          <p>Participation History</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex item-center gap-6">
        <div className="group relative">
          <img src={assets.user} className="w-8 cursor-pointer" alt="Profile" />

          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>

                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtheleteNavbar;
