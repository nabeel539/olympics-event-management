import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { setToken, setIsAdmin } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setToken("");
    navigate("/");
  };

  return (
    <nav className="bg-black p-4 flex justify-between items-center shadow-md">
      <ul className="flex space-x-4 items-center">
        <li>
          <Link to="/admin-dashboard" className="text-white text-2xl font-bold">
            <div>
              <img src={assets.logo1} className="w-14" />
              <img src={assets.logo2} className="w-14" />
            </div>
          </Link>
        </li>
        <li>
          <Link to="/create-events" className="text-white">
            Events
          </Link>
        </li>
        <li>
          <Link to="/all-athletes" className="text-white">
            Athletes
          </Link>
        </li>
        <li>
          <Link to="/announcement" className="text-white">
            Results
          </Link>
        </li>
      </ul>
      <div className="flex items-center">
        <p
          onClick={logout}
          className="text-white cursor-pointer hover:underline"
        >
          Logout
        </p>
      </div>
    </nav>
  );
};

export default AdminNavbar;
