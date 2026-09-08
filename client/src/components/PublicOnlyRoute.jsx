import { Navigate } from "react-router-dom";
import { getDashboardForRole } from "./PrivateRoute";

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (token && role) {
    return <Navigate to={getDashboardForRole(role)} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
