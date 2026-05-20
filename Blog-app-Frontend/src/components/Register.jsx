import { useForm } from "react-hook-form";
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
  divider,
  loadingClass,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

function Register() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    if (!newUser.role) {
      setError("Please select User or Author");
      setLoading(false);
      return;
    }

    const endpoint =
      (newUser.role || "").toLowerCase() === "author"
        ? "http://localhost:4000/author-api/users"
        : "http://localhost:4000/user-api/users";

    try {
      const formData = new FormData();
      const { profilePic, ...userObj } = newUser;

      // Ensure role is present in userObj
      if (!userObj.role) {
        userObj.role = "user";
      }

      Object.entries(userObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (profilePic && profilePic[0]) {
        formData.append("profilePic", profilePic[0]);
      }


     const resObj = await axios.post(endpoint, formData);

      if (resObj.status === 201) {
        navigate("/login");
        return;
      }

      setError(`Unexpected status: ${resObj.status}`);
    } catch (err) {
      console.error("Register error:", err.response || err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading === true) {
    return <p className={loadingClass}></p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">User</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="author"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">Author</span>
              </label>
            </div>
          </div>

          <div className={divider} />

          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="First name"
                className={inputClass}
              />
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("profilePic")}
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setError("Only JPG or PNG allowed");
                    return;
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    setError("File size must be less than 2MB");
                    return;
                  }

                  const previewUrl = URL.createObjectURL(file);
                  setPreview(previewUrl);
                  setError(null);
                }
              }}
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-24 h-24 object-cover rounded-full"
            />
          )}

          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-violet-600 hover:text-violet-500 font-medium"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;