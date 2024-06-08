import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useSignIn from "react-auth-kit/hooks/useSignIn";

function Register() {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.error) {
        toast.error("Nie można zarejestrować użytkownika. Dane już istnieją.");
      }
      if (responseData.data) {
        console.log(responseData);
        signIn({
          auth: { token: data.token, type: "Bearer" },
          userState: {
            id: `${responseData.data._id}`,
            username: `${responseData.data.username}`,
            email: `${responseData.data.email}`,
          },
        });
        toast.success("Rejestracja udana");
        navigate("/feed");
      } else {
        throw new Error(
          responseData.message || "Nie można zarejestrować użytkownika."
        );
      }
    } catch (error) {
      toast.error((error as any).message || "Niepoprawne dane rejestracji");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-2"
      >
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-[300px]"
          {...register("username", {
            required: "Username is required",
            minLength: 5,
          })}
        />
        {errors.username && (
          <p className="text-red-500">{(errors as any).username.message}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-[300px]"
          {...register("email", { required: "Email is required" })}
        />
        {(errors as any).email && (
          <p className="text-red-500">{(errors as any).email.message}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-[300px]"
          {...register("password", {
            required: "Password is required",
            minLength: 6,
          })}
        />
        {(errors as any).password && (
          <p className="text-red-500">{(errors as any).password.message}</p>
        )}
        <button type="submit" className="btn btn-secondary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
