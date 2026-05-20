import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import AuthorDashboard from "./components/AuthorDashboard";
import AdminProfile from "./components/AdminProfile";
import ProfileRedirect from "./components/ProfileRedirect";
import ArticleByID from "./components/ArticleById";
import AuthorArticles from "./components/AuthorArticles";
import WriteArticle from "./components/WriteArticle";
import { Toaster } from "react-hot-toast";
import EditArticle from "./components/EditArticleForm";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard";
import ManageUsers from "./components/ManageUsers";
import ManageArticles from "./components/ManageArticles";
import ManageAuthors from "./components/ManageAuthors";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <div> You are not authorized to access this page.Please login as author to write an article. </div>,
      children: [
        ,
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "profile",
          element: <ProfileRedirect />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,
          children: [
            {
              index: true,
              element: <AuthorDashboard />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "admin-profile",
          element: <AdminProfile />,
        },
        {
          path: "admin-dashboard",
          element: (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          ),
        },
        {
          path: "admin-users",
          element: (
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          ),
        },
        {
          path: "admin-articles",
          element: (
            <AdminRoute>
              <ManageArticles />
            </AdminRoute>
          ),
        },
        {
          path: "admin-authors",
          element: (
            <AdminRoute>
              <ManageAuthors />
            </AdminRoute>
          ),
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path:"edit-article",
          element:<EditArticle />
        }
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;