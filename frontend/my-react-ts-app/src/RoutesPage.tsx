import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Feed from "./components/feed";

const RoutesPage = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
};

export default RoutesPage;
