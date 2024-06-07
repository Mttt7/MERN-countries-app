export interface ReviewResponseDto {
  id: string;
  googleMapsUrl: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
