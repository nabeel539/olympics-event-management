import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { token, setToken, setIsAdmin } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setToken("");
    navigate("/");
  };

  return (
    <nav className="bg-red-900 p-4 flex justify-between items-center">
      <ul className="flex space-x-4 items-center">
        <li>
          <Link to="/admin-dashboard" className="text-white text-2xl font-bold">
            Admin Dashboard
          </Link>
        </li>
        <li>
          <Link to="/create-events" className="text-white">
            Events
          </Link>
        </li>
        {/* <li>
          <Link to="/all-tickets" className="text-white">
            Bookings
          </Link>
        </li> */}
      </ul>
      <div className="flex item-center gap-6">
        <div className="group relative">
          <img src={assets.user} className="w-8 cursor-pointer" alt="Profile" />

          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                {/* <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p> */}

                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
