import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  ghostBtn,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function AuthorDashboard() {
  const currentUser = useAuth((state) => state.currentUser);

  const fullName =
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") ||
    currentUser?.username ||
    "Author";

  return (
    <div className={pageWrapper}>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-4xl bg-white border border-[#e8e8ed] p-10 shadow-sm">
          <p className={pageTitleClass}>Welcome back, {fullName}</p>
          <p className={`${bodyText} mt-4 max-w-2xl`}>
            This is your author profile. Manage your articles, publish new work, and keep your author dashboard in one place.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Email
              </p>
              <p className="mt-3 text-base font-semibold text-slate-900 break-all leading-relaxed">
                {currentUser?.email || "No email available"}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Role
              </p>
              <p className="mt-3 text-base font-semibold text-slate-900">
                {currentUser?.role || "AUTHOR"}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <NavLink
                to="articles"
                className={({ isActive }) =>
                  `${isActive ? navLinkActiveClass : navLinkClass} rounded-full px-5 py-2`
                }
              >
                View articles
              </NavLink>
              <NavLink
                to="write-article"
                className={({ isActive }) =>
                  `${isActive ? navLinkActiveClass : navLinkClass} rounded-full px-5 py-2`
                }
              >
                Write article
              </NavLink>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-[#f8fafc] border border-[#e2e8f0] p-10 shadow-sm">
          <div className="flex flex-col gap-7">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Author summary
              </p>
              <p className="mt-4 text-base text-slate-700 leading-7">
                Keep your profile updated and use the quick links to publish new content or review your articles.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Start writing</p>
                <NavLink
                  to="write-article"
                  className={`${ghostBtn} inline-flex items-center justify-center px-4 py-2`}
                >
                  Start now
                </NavLink>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-6">
                Create your next article and share your ideas with the community.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Manage articles</p>
                <NavLink
                  to="articles"
                  className={`${ghostBtn} inline-flex items-center justify-center px-4 py-2`}
                >
                  View list
                </NavLink>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-6">
                Review and edit your published work from one centralized place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorDashboard;
