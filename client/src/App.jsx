import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar";   // 👈 ADD THIS
import JobApplicants from "./pages/JobApplicants";

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 NAVBAR ALWAYS ON TOP */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route path="/employer" element={<EmployerDashboard/>} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/job-applicants/:id" element={<JobApplicants />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;