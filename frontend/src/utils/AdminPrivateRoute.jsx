/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return isAdmin ? children : <Navigate to={"/"} />;
};

export default AdminPrivateRoute;
