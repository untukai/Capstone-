
import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, className }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;

  const handleMouseEnter = (index: number) => {
    if (onRatingChange) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const isInteractive = !!onRatingChange;

  return (
    <div className={`flex items-center ${isInteractive ? 'cursor-pointer' : ''} ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const currentRating = hoverRating || rating;
        
        return (
          <StarIcon
            key={index}
            className={`w-5 h-5 transition-colors ${currentRating >= starValue ? 'text-yellow-400' : 'text-neutral-300'}`}
            fill={currentRating >= starValue ? 'currentColor' : 'none'}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
