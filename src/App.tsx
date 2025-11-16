import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Explore from "./pages/explore/Explore";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth children={<Layout />} />}>
        <Route index element={<Explore />} />
      </Route>
    </Routes>
  );
}

export default App;
