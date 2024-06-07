import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Feed from "./components/feed";
import { useNavigate } from "react-router-dom";
import RoutesPage from "./RoutesPage";

function App() {
  const navigate = useNavigate();
  return (
    <div
      style={{ fontFamily: "Dosis, sans-serif" }}
      className="flex flex-col items-center justify-center"
    >
      <header className="fixed top-0 w-full bg-neutral shadow z-50">
        <nav className="text-center flex items-center justify-between gap-4 h-14 px-10">
          <div className="text-primary text-3xl">
            <span
              className="font-bold cursor-pointer"
              onClick={() => navigate("/feed")}
            >
              🍴Zjadlem
            </span>
            .pl
          </div>
          <div className="flex items-center justify-center gap-3">
            <a
              onClick={() => navigate("/login")}
              className="text-secondary cursor-pointer"
            >
              Zaloguj się
            </a>
            <a
              onClick={() => navigate("/register")}
              className="text-secondary cursor-pointer"
            >
              Rejestracja
            </a>
          </div>
        </nav>
      </header>
      <div className="mt-20">
        <RoutesPage />
      </div>
    </div>
  );
}
export default App;
