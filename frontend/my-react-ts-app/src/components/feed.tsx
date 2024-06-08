import { useCallback, useEffect, useRef, useState } from "react";
import { Review } from "../models/Review";
import Actions from "./actions";
import { IUserData } from "../models/IUserData";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useNavigate } from "react-router-dom";

interface ReviewResponse {
  reviews: Review[];
  page: number;
  limit: number;
  isLastPage: boolean;
}

function RatingText({ rating }: { rating: number }) {
  let textColor;

  if (rating >= 1.0 && rating < 3.0) {
    textColor = "text-red-500"; // Czerwony
  } else if (rating >= 3.0 && rating < 5.0) {
    textColor = "text-yellow-500"; // Żółty
  } else if (rating >= 5.0 && rating < 7.0) {
    textColor = "text-blue-500"; // Zielony
  } else if (rating >= 7.0 && rating < 9.0) {
    textColor = "text-green-700"; // Ciemniejszy zielony
  } else if (rating >= 9.0 && rating <= 10.0) {
    textColor =
      "bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 text-transparent bg-clip-text font-bold"; // Gradient imitujący tęczę
  }

  return <div className={textColor + " text-3xl"}>{rating}</div>;
}

function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const authHeader = useAuthHeader();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reviews?limit=10&page=${page}`
        );
        const data: ReviewResponse = await response.json();
        console.log(data);
        setReviews((prevReviews) => [...prevReviews, ...data.reviews]); // Append new reviews
        setIsLastPage(data.isLastPage);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (!isLastPage) {
      fetchReviews();
    }
  }, [page]);
  const auth = useAuthUser<IUserData>();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastReviewRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLastPage) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLastPage]
  );

  async function handleDeleteReview(id: string | undefined) {
    if (!id) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/reviews/sec/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader && { Authorization: authHeader }),
          },
        }
      );
      if (response.status === 200) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== id)
        );
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  }

  return (
    <div className="my-5 mb-10">
      <ul className="flex flex-col items-center justify-center gap-10">
        {reviews.map((review, index) => (
          <li
            key={review.id}
            ref={index === reviews.length - 1 ? lastReviewRef : null} // Set ref to the last element
            className="text-neutral w-[500px] h-[700px] bg-white rounded-sm 
            flex flex-col items-center justify-start p-4 shadow-2xl fade-in "
          >
            <div className="text-xl italic font-semibold flex items-center justify-center w-full ">
              <div className="w-[33%] text-sm ">
                {" "}
                {review.createdAt.toString().slice(0, 10)}
              </div>
              <div className="w-[33%] text-center">@{review.username}</div>

              {review.userId === auth?.id ? (
                <div className="dropdown dropdown-end w-[33%] flex items-center justify-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="text-sm text-secondary m-1 hover:underline cursor-pointer"
                  >
                    więcej
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <label
                        onClick={() =>
                          (setSelectedReview(review),
                          document.getElementById(
                            "my_modal_5"
                          )! as any).showModal()
                        }
                      >
                        Usuń
                      </label>
                    </li>
                    <li>
                      <label
                        onClick={() => {
                          navigate(`/edit-review/${review.id}`);
                        }}
                      >
                        Edytuj
                      </label>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown dropdown-end w-[33%] flex items-center justify-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="text-sm text-secondary m-1 hover:underline cursor-pointer"
                  >
                    więcej
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <label>Zgłoś</label>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="w-[300px] h-[300px] shadow-xl">
              <img
                className="w-full h-full rounded-md "
                src={review.photoUrl}
              />
            </div>
            <RatingText rating={review.rating} />
            <div className="text-left text-lg text-primary ">
              {review.title},{" "}
              <span className="text-secondary italic">{review.city}</span>
            </div>
            <div className="text-left text-lg">{review.comment}</div>
            <div className="mt-auto text-primary">
              <Actions reviewId={review.id} initialLikes={review.likes} />
            </div>
          </li>
        ))}
      </ul>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Usuń recenzje</h3>
          <p className="py-4">
            Tej decyzji nie można cofnąć. Czy na pewno chcesz usunąć tę
            recenzję?{" "}
            <span className="text-primary">{selectedReview?.title}</span>
          </p>
          <div className="modal-action">
            <form
              method="dialog"
              className="flex items-center justify-center gap-3"
            >
              <button
                className="btn btn-secondary text-white"
                onClick={() => setSelectedReview(null)}
              >
                Anuluj
              </button>
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  handleDeleteReview(selectedReview?.id);
                }}
              >
                Usuń
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Feed;
