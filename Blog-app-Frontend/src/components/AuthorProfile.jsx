import { NavLink, Outlet } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageWrapper,
  navLinkClass,
  navLinkActiveClass,
  divider,
  bodyText,
  mutedText,
} from "../styles/common";

function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);

  const fullName =
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") ||
    currentUser?.username ||
    "Author";

  const profilePicValue =
    currentUser?.profilePic ||
    currentUser?.profileImage ||
    currentUser?.avatar ||
    currentUser?.image ||
    currentUser?.photo ||
    currentUser?.profilePicUrl ||
    currentUser?.profilePic?.secure_url ||
    currentUser?.profilePic?.url;

  const profilePicSrc = (() => {
    if (!profilePicValue || typeof profilePicValue !== "string") return "";
    if (/^https?:\/\//i.test(profilePicValue)) return profilePicValue;
    if (profilePicValue.startsWith("/")) {
      return `http://localhost:4000${profilePicValue}`;
    }

    return `http://localhost:4000/${profilePicValue}`;
  })();

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  return (
    <div className={pageWrapper}>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {profilePicSrc ? (
            <img
              src={profilePicSrc}
              alt={`${fullName} profile`}
              className="h-20 w-20 rounded-full object-cover border border-[#e8e8ed]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1d1d1f] text-2xl font-semibold text-white">
              {initials || "A"}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">{fullName}</h1>
            <p className={bodyText}>{currentUser?.email || "Signed in author"}</p>
            <p className={mutedText}>Manage your articles and publishing workflow here.</p>
          </div>
        </div>
      </div>

      {/* Author Navigation */}
      <div className="flex gap-6 mb-6">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* Nested route content */}
      <Outlet />
    </div>
  );
}

export default AuthorProfile;
