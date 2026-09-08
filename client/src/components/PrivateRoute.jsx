import { Navigate } from "react-router-dom";

export const getDashboardForRole = (role) => {
  if (role === "admin") return "/admin";
  if (role === "employer" || role === "recruiter") return "/employer";
  return "/candidate-dashboard";
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardForRole(role)} replace />;
  }

  return children;
};

export default PrivateRoute;