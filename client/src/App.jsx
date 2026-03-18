import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails"; // ⭐ NEW
import EmployerDashboard from "./pages/EmployerDashboard";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar";
import JobApplicants from "./pages/JobApplicants";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import EmployerLayout from "./components/EmployerLayout";
import EmployerJobs from "./pages/EmployerJobs";
import EmployerApplicants from "./pages/EmployerApplicants";
import EmployerAnalytics from "./pages/EmployerAnalytics";
import EmployerProfile from "./pages/EmployerProfile";
import SelectRole from "./pages/SelectRole";
import EmployerSetup from "./pages/EmployerSetup";
import CandidateSetup from "./pages/CandidateSetup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Layout() {
  const location = useLocation();

  const showNavbar =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register";

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-[#020617]">

      {showNavbar && <Navbar />}

      <div className={showNavbar ? "pt-16 w-full" : "w-full"}>

        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/employer-setup" element={<EmployerSetup />} />
          <Route path="/candidate-setup" element={<CandidateSetup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ⭐ NEW JOB DETAILS PAGE */}
          <Route path="/job/:id" element={<JobDetails />} />

          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/job-applicants/:id" element={<JobApplicants />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />

          {/* EMPLOYER ROUTES */}

          <Route path="/employer" element={<EmployerLayout />}>

            <Route index element={<EmployerDashboard />} />
            <Route path="jobs" element={<EmployerJobs />} />
            <Route path="applicants" element={<EmployerApplicants />} />
            <Route path="analytics" element={<EmployerAnalytics />} />
            <Route path="profile" element={<EmployerProfile />} />

          </Route>

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