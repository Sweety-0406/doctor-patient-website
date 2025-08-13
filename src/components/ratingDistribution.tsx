"use client"

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Award } from 'lucide-react';

interface RatingDistributionProps {
  counts: { [key: string]: number };
  percentages: { [key: number]: string };
  totalReviews?: number;
  averageRating?: number;
}

function RatingDistribution({ 
  counts, 
  percentages, 
  totalReviews = 0, 
  averageRating = 0 
}: RatingDistributionProps) {
  const [animatedWidths, setAnimatedWidths] = useState<{ [key: number]: string }>({});
  const [isVisible, setIsVisible] = useState(false);

  // Calculate total reviews if not provided
  const calculatedTotal = totalReviews || Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  // Calculate average if not provided
  const calculatedAverage = averageRating || (
    Object.entries(counts).reduce((sum, [star, count]) => sum + (Number(star) * count), 0) / calculatedTotal
  );

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedWidths(
        Object.keys(counts).reduce((acc, star) => ({
          ...acc,
          [Number(star)]: percentages[Number(star)]
        }), {})
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [counts, percentages]);

  // Get rating color based on star count
  const getRatingColor = (star: number) => {
    if (star >= 4) return 'from-green-400 to-green-500';
    if (star >= 3) return 'from-yellow-400 to-yellow-500';
    if (star >= 2) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  // Get text color for ratings
  const getTextColor = (star: number) => {
    if (star >= 4) return 'text-green-600';
    if (star >= 3) return 'text-yellow-600';
    if (star >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  // Format count for display
  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 relative overflow-hidden'>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full -mr-16 -mt-16 opacity-50" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full -ml-12 -mb-12 opacity-30" />
      
      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Rating Overview</h3>
              <p className="text-gray-500 text-sm">Customer feedback distribution</p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(calculatedAverage)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {calculatedAverage.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {formatCount(calculatedTotal)} reviews
            </div>
          </div>
        </div>
      </div>

      {/* Rating Bars */}
      <div className="relative z-10 ">
        {Object.keys(counts)
          .filter(star => Number(star) > 0)
          .sort((a, b) => Number(b) - Number(a))
          .map((star, index) => {
            const starNum = Number(star);
            const count = counts[star];
            
            return (
              <div 
                key={star} 
                className="group"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? 'slideInLeft 0.6s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  {/* Star Rating Label */}
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-lg font-semibold text-gray-700">{star}</span>
                    <Star className={`w-4 h-4 ${getTextColor(starNum)} fill-current`} />
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 h-4 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${getRatingColor(starNum)} rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ 
                          width: isVisible ? animatedWidths[starNum] || '0%' : '0%' 
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                             style={{
                               backgroundSize: '200% 100%',
                               animation: isVisible ? 'shimmer 2s ease-in-out' : 'none'
                             }} 
                        />
                      </div>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {count} review{count !== 1 ? 's' : ''}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="flex items-center space-x-4 min-w-[100px] justify-end">
                    <span className="text-sm font-medium text-gray-600">
                      {percentages[starNum]}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCount(count)}
                      </div>
                      <div className="text-xs text-gray-500">reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Insights */}
      {calculatedTotal > 0 && (
        <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">Satisfaction</span>
              </div>
              <div className="text-2xl font-bold text-green-800">
                {(((counts['4'] || 0) + (counts['5'] || 0)) / calculatedTotal * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-green-600">4+ star ratings</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">Excellence</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {((counts['5'] || 0) / calculatedTotal * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-blue-600">5 star ratings</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-700">Total</span>
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {formatCount(calculatedTotal)}
              </div>
              <div className="text-xs text-purple-600">reviews</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}

export default RatingDistribution;