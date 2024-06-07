import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Feed from "./components/feed";
import NewReview from "./components/newReview";

const RoutesPage = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/add-new-review" element={<NewReview />} />
    </Routes>
  );
};

export default RoutesPage;
