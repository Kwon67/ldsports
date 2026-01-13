'use client';

interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-none stroke-gray-300'}`}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma avaliação ainda.</p>
        <p className="text-sm">Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="font-medium text-sm">{review.author}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <p className="text-sm text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
