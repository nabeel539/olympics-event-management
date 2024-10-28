/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = "http://localhost:3000";
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, [token, isAdmin]);
  const contextvalue = {
    backendUrl,
    token,
    setToken,
    isAdmin,
    setIsAdmin,
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
/* eslint-disable react/prop-types */
// import { createContext, useEffect, useState } from "react";

// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//   const backendUrl = "http://localhost:3000";
//   const [token, setToken] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Only load token and isAdmin once when the component mounts
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedIsAdmin = localStorage.getItem("isAdmin");

//     if (storedToken) {
//       setToken(storedToken);
//     }
//     if (storedIsAdmin) {
//       setIsAdmin(storedIsAdmin === "true"); // Convert string to boolean if needed
//     }
//   }, []); // Empty dependency array ensures it only runs once

//   const contextValue = {
//     backendUrl,
//     token,
//     setToken,
//     isAdmin,
//     setIsAdmin,
//   };

//   return (
//     <StoreContext.Provider value={contextValue}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreContextProvider;
