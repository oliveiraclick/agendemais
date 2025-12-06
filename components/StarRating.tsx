
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0 to 5
    editable?: boolean;
    onRate?: (rating: number) => void;
    size?: number;
    showCount?: boolean;
    count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    editable = false,
    onRate,
    size = 20,
    showCount = false,
    count = 0
}) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        const isFull = i <= rating;
        const isHalf = !isFull && i - 0.5 <= rating;

        stars.push(
            <button
                key={i}
                type="button"
                disabled={!editable}
                onClick={() => editable && onRate && onRate(i)}
                className={`${editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
            >
                {isFull ? (
                    <Star size={size} className="fill-yellow-400 text-yellow-400" />
                ) : isHalf ? (
                    <div className="relative">
                        <Star size={size} className="text-gray-300" />
                        <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                            <Star size={size} className="fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                ) : (
                    <Star size={size} className="text-gray-300" />
                )}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-1">
            {stars}
            {showCount && <span className="text-sm text-gray-500 ml-2">({count})</span>}
        </div>
    );
};
