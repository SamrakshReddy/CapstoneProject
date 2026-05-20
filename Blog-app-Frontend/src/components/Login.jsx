import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
pageBackground,
formCard,
formTitle,
formGroup,
labelClass,
inputClass,
submitBtn,
errorClass,
mutedText,
linkClass,
} from "../styles/common";

import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

function Login() {
const { register, handleSubmit } = useForm();

const login = useAuth((state) => state.login);
const isAuthenticated = useAuth((state) => state.isAuthenticated);
const currentUser = useAuth((state) => state.currentUser);
const error = useAuth((state) => state.error);

const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);

const onUserLogin = async (userCredObj) => {
await login(userCredObj);
};

useEffect(() => {
  if (isAuthenticated && currentUser) {
    toast.success("Logged in successfully");
    navigate("/profile");
  }
}, [isAuthenticated, currentUser, navigate]);

return (
<div className={`${pageBackground} flex items-center justify-center py-16 px-4`}> <div className={formCard}> <h2 className={formTitle}>Sign In</h2>

    {error && <p className={errorClass}>{error}</p>}

    <form onSubmit={handleSubmit(onUserLogin)}>

      {/* Email */}
      <div className={formGroup}>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="enter email"
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className={`${formGroup} relative`}>
        <label className={labelClass}>Password</label>

        <input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          placeholder="enter password"
          className={inputClass}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-500"
        >
          {showPassword ? (
            /* Eye Slash */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a20.42 20.42 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.31 21.31 0 0 1-2.34 3.94M1 1l22 22"/>
            </svg>
          ) : (
            /* Eye */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>

      {/* Forgot Password */}
      <div className="text-right -mt-2 mb-4">
        <a href="/forgot-password" className={`${linkClass} text-xs`}>
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button type="submit" className={submitBtn}>
        Sign In
      </button>
    </form>

    <p className={`${mutedText} text-center mt-5`}>
      Don't have an account?{" "}
      <NavLink to="/register" className={linkClass}>
        Create one
      </NavLink>
    </p>
  </div>
</div>


);
}

export default Login;
