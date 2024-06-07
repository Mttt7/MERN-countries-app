import React from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IUserData } from "../models/IUserData";

function Login() {
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const auth = useAuthUser<IUserData>();
  const signOut = useSignOut();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = async (credentials: any) => {
    if (isValid) {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.status === 400) {
          if (data === "The password is incorrect") {
            throw new Error(data);
          } else if (data === "No record existed") {
            throw new Error("The user with this email address does not exist");
          } else {
            throw new Error(data);
          }
        }

        signIn({
          auth: { token: data.token, type: "Bearer" },
          userState: {
            id: `${data.user.id}`,
            username: `${data.user.username}`,
            email: `${credentials.email}`,
          },
        });
        navigate("/feed");
      } catch (error: any) {
        toast.error("Niepoprawne dane logowania");
      }
    } else {
      toast.error("Wypełnij wszystkie pola");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-xl">Jesteś zalogowany jako @{auth?.username}</p>
          <div
            className="btn btn-error"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
          >
            Wyloguj
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              {...register("email", { required: true, minLength: 3 })}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true, minLength: 3 })}
            />
          </div>
          <button type="submit">Log in</button>
        </form>
      )}
    </>
  );
}

export default Login;
