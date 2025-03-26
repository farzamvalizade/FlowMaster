import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Login = lazy(() => import("./Login.jsx"));
const Register = lazy(() => import("./Register.jsx"))
const About = lazy(() => import("./About.jsx"));
const Contact = lazy(() => import("./Contact.jsx"));
const Profile = lazy(() => import("./Profile.jsx"));
const Dashboard = lazy(() => import("./Dashboard.jsx"));
const ProjectDetail = lazy(() => import("./ProjectDetail.jsx"));
const TaskDetail = lazy(() => import("./TaskDetail.jsx"));
const NotFound = lazy(() => import("./NotFound"));


// Routes
const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/profile", element: <Profile />},
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/project/:slug", element: <ProjectDetail /> },
  { path: "task/:slug", element: <TaskDetail /> },
  { path: "*", element: <NotFound /> },
];

export default routes;

