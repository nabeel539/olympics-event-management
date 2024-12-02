import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AthleteAuthForm = () => {
  const { backendUrl, setToken, setIsAdmin } = useContext(StoreContext);
  const navigate = useNavigate();
  const [athleteData, setAthleteData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });
  const [isLogin, setIsLogin] = useState(true); // State to toggle between signup and login

  const handleOnChange = (e) => {
    setAthleteData({ ...athleteData, [e.target.name]: e.target.value });
  };

  const handleAthleteAuth = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Athelete login
        let newUrl = `${backendUrl}/api/athletes/login`;
        const response = await axios.post(newUrl, {
          email: athleteData.email,
          password: athleteData.password,
        });

        if (response.data.success) {
          setToken(response.data.token);

          // Set token in localStorage
          console.log(response.data.token);
          localStorage.setItem("token", response.data.token);
          // Set role in localStorage
          setIsAdmin(false);
          localStorage.setItem("isAdmin", false);

          toast.success("Login Successful");
          navigate("/events");
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Athelete sign up
        let newUrl = `${backendUrl}/api/athletes/register`;
        const response = await axios.post(newUrl, athleteData);

        if (response.data.success) {
          // Set role in localStorage
          console.log(response.data);

          setToken(response.data.token);
          localStorage.setItem("isAdmin", false);
          localStorage.setItem("token", response.data.token);

          toast.success("Register Successful");
          navigate("/events");
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      // Error handling
      toast.error("Invalid Credentials");
      console.error("Error: ", error);

      // Reset form data if error occurs
      if (isLogin) {
        setAthleteData({
          email: "",
          password: "",
        });
      } else {
        setAthleteData({
          name: "",
          email: "",
          country: "",
          password: "",
        });
      }
    }
  };

  return (
    <form onSubmit={handleAthleteAuth} className="space-y-4">
      <h2 className="font-bold text-center text-2xl">
        {isLogin ? "Athlete Login" : "Athlete Sign Up"}
      </h2>

      {!isLogin && (
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={athleteData.name}
            onChange={handleOnChange}
            className="border p-2 w-full"
            required
          />
        </div>
      )}

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={athleteData.email}
          onChange={handleOnChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={athleteData.password}
          onChange={handleOnChange}
          className="border p-2 w-full"
          required
        />
      </div>

      {!isLogin && (
        <div>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={athleteData.country}
            onChange={handleOnChange}
            className="border p-2 w-full"
            required
          />
        </div>
      )}

      <p className="text-xs">
        {isLogin ? "Create a new account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="cursor-pointer font-bold text-blue-500"
        >
          {isLogin ? "Sign Up" : "Login here"}
        </span>
      </p>

      <button
        type="submit"
        className="bg-[#0a0b0b] text-white py-2 px-4 w-full rounded-md font-medium"
      >
        {isLogin ? "Login as Athlete" : "Sign Up as Athlete"}
      </button>
    </form>
  );
};

export default AthleteAuthForm;
