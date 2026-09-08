import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateRegister from "./pages/CandidateRegister";
import RecruiterRegister from "./pages/RecruiterRegister";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateSetup from "./pages/CandidateSetup";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobRecommendations from "./pages/JobRecommendations";
import InterviewExperiences from "./pages/InterviewExperiences";
import VerifiedAssessments from "./pages/VerifiedAssessments";
import CareerTools from "./pages/CareerTools";
import Chat from "./pages/Chat";

import EmployerSetup from "./pages/EmployerSetup";
import EmployerLayout from "./components/EmployerLayout";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerJobs from "./pages/EmployerJobs";
import EmployerApplicants from "./pages/EmployerApplicants";
import EmployerAnalytics from "./pages/EmployerAnalytics";
import EmployerProfile from "./pages/EmployerProfile";
import JobApplicants from "./pages/JobApplicants";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import AdminApplications from "./pages/AdminApplications";
import AdminSettings from "./pages/AdminSettings";

import Navbar from "./components/Navbar";

function Layout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/register" ||
    location.pathname === "/register-candidate" ||
    location.pathname === "/register-recruiter" ||
    location.pathname === "/forgot-password";

  const isEmployerOrAdmin =
    location.pathname.startsWith("/employer") ||
    location.pathname.startsWith("/admin");

  const showNavbar = !isAuthPage && !isEmployerOrAdmin;

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-[#020617]">
      <Toaster position="top-right" />

      {showNavbar && <Navbar />}

      <div className={showNavbar ? "pt-16 w-full" : "w-full"}>
        <Routes>
          {/* ── PUBLIC ONLY ROUTES (Redirect to Dashboard if already logged in) ── */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/admin-login"
            element={
              <PublicOnlyRoute>
                <AdminLogin />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register-candidate"
            element={
              <PublicOnlyRoute>
                <CandidateRegister />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register-recruiter"
            element={
              <PublicOnlyRoute>
                <RecruiterRegister />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />

          {/* ── CANDIDATE PROTECTED ROUTES ── */}
          <Route
            path="/candidate-dashboard"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <CandidateDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidate-setup"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <CandidateSetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <PrivateRoute allowedRoles={["candidate", "user", "admin"]}>
                <Jobs />
              </PrivateRoute>
            }
          />
          <Route
            path="/job/:id"
            element={
              <PrivateRoute allowedRoles={["candidate", "user", "employer", "recruiter", "admin"]}>
                <JobDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <SavedJobs />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <MyApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/resume-builder"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <ResumeBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <ResumeAnalyzer />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-recommendations"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <JobRecommendations />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview-experiences"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <InterviewExperiences />
              </PrivateRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <VerifiedAssessments />
              </PrivateRoute>
            }
          />
          <Route
            path="/career-tools"
            element={
              <PrivateRoute allowedRoles={["candidate", "user"]}>
                <CareerTools />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute allowedRoles={["candidate", "user", "employer", "recruiter"]}>
                <Chat />
              </PrivateRoute>
            }
          />

          {/* ── RECRUITER / EMPLOYER PROTECTED ROUTES ── */}
          <Route
            path="/employer-setup"
            element={
              <PrivateRoute allowedRoles={["employer", "recruiter"]}>
                <EmployerSetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer"
            element={
              <PrivateRoute allowedRoles={["employer", "recruiter"]}>
                <EmployerLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EmployerDashboard />} />
            <Route path="jobs" element={<EmployerJobs />} />
            <Route path="applicants" element={<EmployerApplicants />} />
            <Route path="analytics" element={<EmployerAnalytics />} />
            <Route path="profile" element={<EmployerProfile />} />
          </Route>
          <Route
            path="/job-applicants/:id"
            element={
              <PrivateRoute allowedRoles={["employer", "recruiter"]}>
                <JobApplicants />
              </PrivateRoute>
            }
          />

          {/* ── ADMIN PROTECTED ROUTES ── */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── CATCH ALL (Redirect to Landing / Login) ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
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