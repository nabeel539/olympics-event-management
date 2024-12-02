import { Outlet } from "react-router-dom";
import Footer from "../Shared/Footer";
import AtheleteNavbar from "../Shared/AtheleteNavbar";

const AtheleteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AtheleteNavbar />
      <main className="flex-grow">
        <Outlet /> {/* Nested routes will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};

export default AtheleteLayout;
