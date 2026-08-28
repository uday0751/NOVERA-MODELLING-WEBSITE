interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: {
    full_name?: string;
    role?: string;
  };
}

interface ReviewsListProps {
  reviews: ReviewItem[];
}

export function ReviewsList({ reviews = [] }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="border p-4 rounded bg-gray-50 text-center text-xs text-gray-500">
        No client or model reviews submitted yet.
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="border p-4 rounded bg-white text-black space-y-4 shadow-xs">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold text-base">Reviews ({reviews.length})</h3>
        <span className="text-xs font-bold text-amber-600 border border-amber-300 bg-amber-50 px-2 py-0.5 rounded">
          ★ {averageRating} / 5.0 Average
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => {
          const reviewerName = r.reviewer?.full_name || 'Anonymous User';
          return (
            <div key={r.id} className="border-b pb-3 space-y-1 text-xs last:border-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-amber-600">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                  <span className="font-semibold text-black">{reviewerName}</span>
                </div>
                <span className="text-gray-400 text-[10px]">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{r.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
