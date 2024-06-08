import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast } from "sonner";

function Actions({
  reviewId,
  initialLikes,
}: {
  reviewId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const authHeader = useAuthHeader();

  const toggleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${reviewId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader && { Authorization: authHeader }),
          },
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setLikes(data.likes);
        toast.success("Lajk dodany!");
      } else {
        throw new Error(data.message || "Nie udało się zaktualizować lajków.");
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast.error(error.message || "Problem z lajkowaniem recenzji.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <button onClick={toggleLike} className="btn btn-secondary text-white">
          Like
        </button>
        <div className="text-xl font-semibold text-secondary ">{likes}</div>
      </div>
    </>
  );
}

export default Actions;
