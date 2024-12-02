import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import { ToastContainer } from "react-toastify";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import AdminLayout from "./widgets/Layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AtheleteLayout from "./widgets/Layout/AtheleteLayout";
// import AthleteDashboard from "./pages/AthleteDashboard";
import UpcomingEventAthelete from "./pages/UpcomingEventAthelete";
import AtheleteHistory from "./pages/AtheleteHistory";
import AtheleteProfile from "./pages/AtheleteProfile";
import AdminEventPage from "./pages/AdminEvent";
import ResultAnnouncement from "./pages/ResultAnnouncement";
import AllAthletes from "./pages/AllAthletes";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Athelete Routes */}
        <Route element={<AtheleteLayout />}>
          {/* <Route path="/athelete-dashboard" element={<AthleteDashboard />} /> */}
          <Route path="/events" element={<UpcomingEventAthelete />} />
          <Route path="/history" element={<AtheleteHistory />} />
          <Route path="/profile" element={<AtheleteProfile />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/create-events" element={<AdminEventPage />} />
          <Route path="/announcement" element={<ResultAnnouncement />} />
          <Route path="/all-athletes" element={<AllAthletes />} />
        </Route>

        {/* Auth Route */}
        <Route path="/" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
