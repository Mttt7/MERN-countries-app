import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Feed from "./components/feed";
import NewReview from "./components/newReview";
import EditReview from "./components/editReview";

const RoutesPage = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/add-new-review" element={<NewReview />} />
      <Route path="/edit-review/:reviewId" element={<EditReview />} />
    </Routes>
  );
};

export default RoutesPage;
