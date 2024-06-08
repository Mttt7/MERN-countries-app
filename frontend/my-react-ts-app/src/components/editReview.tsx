import { useEffect, useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function EditReview() {
  const [rating, setRating] = useState(5.0);
  const { reviewId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const authHeader = useAuthHeader();

  const ratingValue = watch("rating", rating);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reviews/sec/${reviewId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(authHeader && { Authorization: authHeader }),
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          reset(data);
        } else {
          throw new Error(data.message || "Problem z pobraniem danych");
        }
      } catch (error: any) {
        console.error("Failed to fetch review:", error);
        toast.error(error.message || "Failed to fetch review");
      }
    };

    fetchData();
  }, [reviewId, reset, authHeader]);

  const onSubmit = async (updatedReview: any) => {
    if (isValid) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reviews/sec/${reviewId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(authHeader && { Authorization: authHeader }),
            },
            body: JSON.stringify(updatedReview),
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
        <button className="btn btn-secondary">Edytuj</button>
      </form>
    </div>
  );
}

export default EditReview;
