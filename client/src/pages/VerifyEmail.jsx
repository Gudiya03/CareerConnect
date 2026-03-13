import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await API.get(`/auth/verify-email/${token}`);
        alert("Email verified successfully");
        navigate("/login");
      } catch (err) {
        alert("Verification failed");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h2>Verifying email...</h2>
    </div>
  );
};

export default VerifyEmail;