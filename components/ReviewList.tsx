
import React from 'react';
import { Review } from '../types';
import { StarRating } from './StarRating';

interface ReviewListProps {
    reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Ainda não há avaliações. Seja o primeiro a avaliar!</p>
            </div>
        );
    }

    // Sort by date desc
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4">
            {sortedReviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-semibold text-gray-800">{review.clientName}</p>
                            <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <StarRating rating={review.rating} size={16} />
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                </div>
            ))}
        </div>
    );
};
