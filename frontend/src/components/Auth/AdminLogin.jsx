import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLoginForm = () => {
  const { backendUrl, setToken, setIsAdmin } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/admin/login", data);
      if (response.data.success) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", true);
        setToken(response.data.token);
        console.log(response.data.token);

        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful");
        navigate("/admin-dashboard");
      } else {
        toast.error("Invalid Credentials.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message || "An error occurred during login.");
      setData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="space-y-4">
      <h2 className="font-bold text-center text-2xl">Admin Login</h2>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={onChangeHandler}
          className="border p-2 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-[#0a0b0b] text-white py-2 px-4 w-full rounded-md font-medium"
      >
        Login as Admin
      </button>
    </form>
  );
};

export default AdminLoginForm;
