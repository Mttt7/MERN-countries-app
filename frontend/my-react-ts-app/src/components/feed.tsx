import { useCallback, useEffect, useRef, useState } from "react";
import { Review } from "../models/Review";
import Actions from "./actions";

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reviews?limit=10&page=${page}`
        );
        const data: ReviewResponse = await response.json();

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

  return (
    <div className="my-5 mb-10">
      <ul className="flex flex-col items-center justify-center gap-10">
        {reviews.map((review, index) => (
          <li
            key={review.id}
            ref={index === reviews.length - 1 ? lastReviewRef : null} // Set ref to the last element
            className="text-neutral w-[500px] h-[700px] bg-white rounded-sm 
            flex flex-col items-center justify-start p-4 shadow-2xl fade-in"
          >
            <div className="text-xl italic font-semibold">
              @{review.username}
            </div>
            <div className="w-[300px] h-[300px] shadow-xl">
              <img
                className="w-full h-full rounded-md "
                src="https://picsum.photos/900"
              />
            </div>
            <RatingText rating={review.rating} />
            <div className="text-left text-lg">{review.comment}</div>
            <div className="mt-auto">
              <Actions />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;
