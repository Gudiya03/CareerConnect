import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ⭐ GLOBAL TOASTS

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
import Home from "./pages/Home"; // ⭐ NEW LANDING PAGE
import SavedJobs from "./pages/SavedJobs"; // ⭐ NEW SAVED JOBS PAGE
import AdminLayout from "./components/AdminLayout"; // ⭐ NEW ADMIN SIDE
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import AdminApplications from "./pages/AdminApplications";
import AdminSettings from "./pages/AdminSettings";
import ResumeBuilder from "./pages/ResumeBuilder";
import CareerTools from "./pages/CareerTools";
import Chat from "./pages/Chat";
import CandidateRegister from "./pages/CandidateRegister";
import RecruiterRegister from "./pages/RecruiterRegister";
import CandidateDashboard from "./pages/CandidateDashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobRecommendations from "./pages/JobRecommendations";
import InterviewExperiences from "./pages/InterviewExperiences";
import VerifiedAssessments from "./pages/VerifiedAssessments";
import AdminLogin from "./pages/AdminLogin";

function Layout() {
  const location = useLocation();

  const showNavbar =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/admin-login" &&
    location.pathname !== "/register";

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-[#020617]">
      <Toaster position="top-right" />

      {showNavbar && <Navbar />}

      <div className={showNavbar ? "pt-16 w-full" : "w-full"}>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-candidate" element={<CandidateRegister />} />
          <Route path="/register-recruiter" element={<RecruiterRegister />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ⭐ NEW PROFILE & BUILDER ROUTES */}
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/career-tools" element={<CareerTools />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/job-recommendations" element={<JobRecommendations />} />
          <Route path="/interview-experiences" element={<InterviewExperiences />} />
          <Route path="/assessments" element={<VerifiedAssessments />} />
          <Route path="/chat" element={<Chat />} />

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

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="settings" element={<AdminSettings />} />
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