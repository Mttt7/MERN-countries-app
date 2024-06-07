import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function NewReview() {
  const [rating, setRating] = useState(5.0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const authHeader = useAuthHeader();

  const ratingValue = watch("rating", rating);

  const onSubmit = async (newReview: any) => {
    if (isValid) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/new/review",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authHeader && { Authorization: authHeader }),
            },

            body: JSON.stringify(newReview),
          }
        );

        const data = await response.json();

        if (response.status === 400) {
          if (data === "Niepoprawne dane") {
            throw new Error(data);
          } else {
            throw new Error(data);
          }
        }

        navigate("/feed");
      } catch (error: any) {
        toast.error("Niepoprawne dane");
      }
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
          placeholder="Place name"
          className="input input-sm input-bordered  max-w-xs w-[300px]"
          {...register("title", { required: true, minLength: 5 })}
        />
        <input
          type="text"
          placeholder="City"
          className="input input-sm input-bordered  max-w-xs w-[300px]"
          {...register("city", { required: true, minLength: 5 })}
        />
        <textarea
          className="textarea textarea-bordered w-[300px]"
          placeholder="Comment"
          {...register("comment", { required: true, minLength: 30 })}
        ></textarea>
        <input
          type="number"
          min={1.0}
          max={10.0}
          defaultValue={5.0}
          step={0.1}
          placeholder="Rating (1-10)"
          className="input input-sm input-bordered  max-w-xs w-[300px]"
          {...register("rating")}
        />
        <progress
          className="progress progress-primary w-[300px]"
          value={ratingValue * 10} // Aktualizuje na podstawie ratingValue
          max="100"
        ></progress>
        <input
          type="text"
          placeholder="Google Maps URL"
          className="input input-sm input-bordered  max-w-xs w-[300px]"
          {...register("googleMapsUrl", { required: false, minLength: 5 })}
        />
        <input type="file" className="file-input  w-[300px]" />
        <button className="btn btn-secondary">Dodaj</button>
      </form>
    </div>
  );
}

export default NewReview;
