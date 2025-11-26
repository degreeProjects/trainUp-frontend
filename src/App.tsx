import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register/Register";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Explore from "./pages/explore/Explore";
import Comments from "./pages/comments/Comments";
import UploadPost from "./pages/UploadPost";
import EditProfile from "./pages/EditProfile";
import CalculateCalories from "./pages/CalculateCalories";
import LikedPosts from "./pages/LikedPosts";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth children={<Layout />} />}>
        <Route index element={<Explore />} />
        <Route path="comments/:postId" element={<Comments />} />
        <Route path="upload" element={<UploadPost />} />
        <Route path="calories/burn" element={<CalculateCalories />} />
        <Route path="likedPosts" element={<LikedPosts />} />
        <Route path="profile/edit" element={<EditProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
