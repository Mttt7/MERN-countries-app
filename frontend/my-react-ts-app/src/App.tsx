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
import { Toaster } from "sonner";
import { IUserData } from "./models/IUserData";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

function App() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser<IUserData>();
  return (
    <div
      style={{ fontFamily: "Dosis, sans-serif" }}
      className="flex flex-col items-center justify-center"
    >
      <Toaster position="top-right" />
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
          <div
            className="text-primary text-xl hover:underline cursor-pointer"
            onClick={() => navigate("/add-new-review")}
          >
            Dodaj
          </div>

          {isAuthenticated ? (
            <div
              className="text-xl text-secondary cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              @{auth?.username}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <a
                onClick={() => navigate("/login")}
                className="text-secondary cursor-pointer hover:underline"
              >
                Zaloguj się
              </a>
              <a
                onClick={() => navigate("/register")}
                className="text-secondary cursor-pointer hover:underline"
              >
                Rejestracja
              </a>
            </div>
          )}
        </nav>
      </header>
      <div className="mt-20">
        <RoutesPage />
      </div>
    </div>
  );
}
export default App;
