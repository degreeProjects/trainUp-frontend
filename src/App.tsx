import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Explore from "./pages/explore/Explore";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth children={<Layout />} />}>
        <Route index element={<Explore />} />
        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="edit" element={<EditProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
