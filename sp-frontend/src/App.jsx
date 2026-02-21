import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import GeneratePage from "./pages/GeneratePage";
import RoadmapDetail from "./pages/RoadmapDetail";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryManage from "./pages/admin/CategoryManage";
import SkillManage from "./pages/admin/SkillManage";
import UserManage from "./pages/admin/UserManage";
import Roadmaps from "./pages/Roadmaps";
import Profile from "./pages/Profile";
import FeedbackPage from "./pages/FeedbackPage";

function App() {
  return (
    <>
      <Routes>
        {/* user */}
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
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

        {/* admin */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard></AdminDashboard>}
        ></Route>
        <Route
          path="/admin/category"
          element={<CategoryManage></CategoryManage>}
        ></Route>
        <Route
          path="/admin/skill"
          element={<SkillManage></SkillManage>}
        ></Route>
        <Route path="/admin/user" element={<UserManage></UserManage>}></Route>
      </Routes>
    </>
  );
}

export default App;
