export interface Review {
  id: string;
  googleMapsUrl: string;
  userId: string;
  rating: number;
  comment: string;
  photoUrl: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;

  title: string;
  city: string;

  likes: number;
}
