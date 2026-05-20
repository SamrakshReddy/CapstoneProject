import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { loadingClass } from "../styles/common";

function ProfileRedirect() {
  const currentUser = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const loading = useAuth((state) => state.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (currentUser) {
      if (currentUser.role === "AUTHOR") {
        navigate("/author-profile", { replace: true });
      } else if (currentUser.role === "ADMIN") {
        navigate("/admin-profile", { replace: true });
      } else {
        navigate("/user-profile", { replace: true });
      }
    }
  }, [currentUser, isAuthenticated, loading, navigate]);

  if (loading || !currentUser) {
    return <p className={loadingClass}>Redirecting to your profile…</p>;
  }

  return null;
}

export default ProfileRedirect;
