import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar";
import JobApplicants from "./pages/JobApplicants";

function Layout() {
  const location = useLocation();

  const showNavbar =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register";

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {showNavbar && <Navbar />}

      {/* Add space if navbar is fixed */}
      <div className={showNavbar ? "pt-16 w-full" : "w-full"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/job-applicants/:id" element={<JobApplicants />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;