import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import GeneratePage from "./pages/GeneratePage";
import RoadmapDetail from "./pages/RoadmapDetail";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SkillManage from "./pages/admin/SkillManage";
import UserManage from "./pages/admin/UserManage";
import RoadmapManage from "./pages/admin/RoadmapManage";
import AdminProfile from "./pages/admin/AdminProfile";
import Roadmaps from "./pages/Roadmaps";
import Profile from "./pages/Profile";
import FeedbackPage from "./pages/FeedbackPage";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import { getRole, getToken } from "./utils/uttils";

function App() {
  function RedirectRoute({ children }) {
    const token = getToken();
    const role = getRole();

    if (token) {
      if (role == "user") return <Navigate to="/dashboard" replace></Navigate>;
      if (role == "admin")
        return <Navigate to="/admin/dashboard" replace></Navigate>;
    }

    return children;
  }

  return (
    <>
      <Routes>
        {/* user */}
        <Route
          path="/"
          element={
            <RedirectRoute>
              <Login />
            </RedirectRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <RedirectRoute>
              <Register />
            </RedirectRoute>
          }
        ></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/search" element={<Search></Search>}></Route>
        <Route path="/roadmaps" element={<Roadmaps></Roadmaps>}></Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route
          path="/roadmap/:id"
          element={<RoadmapDetail></RoadmapDetail>}
        ></Route>
        <Route
          path="/roadmap/:id/feedback"
          element={<FeedbackPage></FeedbackPage>}
        ></Route>
        <Route
          path="/generate/roadmap"
          element={<GeneratePage></GeneratePage>}
        ></Route>
        <Route
          path="/roadmap/:id"
          element={<RoadmapDetail></RoadmapDetail>}
        ></Route>
        <Route path="/feedback" element={<Feedback></Feedback>}></Route>
        <Route path="/quiz/:phase_id" element={<Quiz></Quiz>}></Route>
        <Route
          path="/quiz/:phase_id/result"
          element={<QuizResult></QuizResult>}
        ></Route>

        {/* admin */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard></AdminDashboard>}
        ></Route>
        <Route
          path="/admin/roadmaps"
          element={<RoadmapManage></RoadmapManage>}
        ></Route>
        <Route
          path="/admin/skill"
          element={<SkillManage></SkillManage>}
        ></Route>
        <Route path="/admin/users" element={<UserManage></UserManage>}></Route>
        <Route
          path="/admin/profile"
          element={<AdminProfile></AdminProfile>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
