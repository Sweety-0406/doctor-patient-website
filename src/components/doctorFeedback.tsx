"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  Star, 
  TrendingUp, 
  MessageSquare, 
  Search,
  Download,
  Eye,
  Reply,
  PieChart,
  Clock,
  ThumbsUp,
  Loader2,
} from 'lucide-react';
import { getAllFeedbacks } from '@/lib/api';
import { FeedbackItem } from '@/app/types';
import { RatingTrendsChart } from './categoryBarChart';
import { motion } from 'framer-motion';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import RatingDistribution from './ratingDistribution';



interface AnalyticsData {
  totalFeedbacks: number;
  averageRating: number;
  recommendationRate: number;
  responseRate: number;
  monthlyTrend: Array<{ month: string; rating: number; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number; avgRating: number }>;
}


const analyticsData: AnalyticsData = {
  totalFeedbacks: 156,
  averageRating: 4.3,
  recommendationRate: 87,
  responseRate: 72,
  monthlyTrend: [
    { month: "Jan", rating: 2.6, count: 23 },
    { month: "Feb", rating: 4.2, count: 28 },
    { month: "Mar", rating: 3.0, count: 31 },
    { month: "Apr", rating: 4.3, count: 27 },
    { month: "May", rating: 2.4, count: 29 },
    { month: "Jun", rating: 4.3, count: 18 },
    { month: "Jul", rating: 5.0, count: 31 },
    { month: "Aug", rating: 3.1, count: 23 },
    { month: "Sep", rating: 3.5, count: 28 },
    { month: "Oct", rating: 4.3, count: 27 },
    { month: "Nov", rating: 3.4, count: 29 },
    { month: "Dec", rating: 4.3, count: 18 }
  ],
  categoryBreakdown: [
    { category: "Service Quality", count: 45, avgRating: 4.2 },
    { category: "Communication", count: 38, avgRating: 4.5 },
    { category: "Overall Experience", count: 42, avgRating: 4.1 },
    { category: "Product/Treatment", count: 31, avgRating: 4.4 }
  ]
};

// Components
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  index?: number; 
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1, // stagger effect
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
      }}
      className="bg-white border-l-2 border-teal-500 rounded-xl shadow-sm p-6 cursor-pointer transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );
};

const FeedbackCard: React.FC<{ feedback: FeedbackItem; onAction: (action: string, id: string) => void }> = 
  ({ feedback, onAction }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  const averageRating = Object.values(feedback.ratings).reduce((a, b) => a + b, 0) / 4;
  const router = useRouter()
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                {feedback.appointment.patientImage ? (
                    <Image
                        src={feedback.appointment.patientImage}
                        alt={feedback.patientName || "Patient"}
                        width={40}
                        height={40}
                        className="object-cover rounded-full w-full h-full"
                    />
                ):(
                    <span className="text-teal-600 font-semibold text-lg">
                        {feedback.patientName.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              { feedback.patientName}
            </h3>
            <p className="text-sm text-gray-500">
              {feedback.appointment.diagnosis} • {new Date(feedback.appointment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(feedback.priority)}`}>
            {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
          </span> */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          {feedback.wouldRecommend && (
            <div className="flex items-center gap-1 text-green-600">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Would Recommend</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Service</span>
            <div className="font-semibold">{feedback.ratings.service}/5</div>
          </div>
          <div>
            <span className="text-gray-500">Quality</span>
            <div className="font-semibold">{feedback.ratings.quality}/5</div>
          </div>
          <div>
            <span className="text-gray-500">Communication</span>
            <div className="font-semibold">{feedback.ratings.communication}/5</div>
          </div>
          <div>
            <span className="text-gray-500">Overall</span>
            <div className="font-semibold">{feedback.ratings.overall}/5</div>
          </div>
        </div>
      </div>

      {/* Feedback Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/doctor/feedbacks/${feedback.id}`)}
            className="px-3 py-1.5 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          {/* <button
            onClick={() => onAction('reply', feedback.id)}
            className="px-3 cursor-pointer py-1.5 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button> */}
        </div>
      </div>
    </div>
  );
};

type ratings = {
    overall: number;
    service: number;
    quality: number;
    communication: number;
}
function calculateDetailedFeedbackStats(feedbacks: FeedbackItem[]) {
  const total = feedbacks.length;

  if (total === 0) {
    return {
      totalFeedbacks: 0,
      ratings: {
        overall: { average: 0, count: 0 },
        service: { average: 0, count: 0 },
        quality: { average: 0, count: 0 },
        communication: { average: 0, count: 0 },
        product: { average: 0, count: 0 }
      },
      recommendationRate: 0,
      responseRate: 0
    };
  }

  let totalOverall = 0, countOverall = 0;
  let totalService = 0, countService = 0;
  let totalQuality = 0, countQuality = 0;
  let totalCommunication = 0, countCommunication = 0;
  let totalProduct = 0, countProduct = 0;

  feedbacks.forEach(f => {
    if (f.ratings.overall != null) {
      totalOverall += f.ratings.overall;
      countOverall++;
    }
    if (f.ratings.service != null) {
      totalService += f.ratings.service;
      countService++;
    }
    if (f.ratings.quality != null) {
      totalQuality += f.ratings.quality;
      countQuality++;
    }
    if (f.ratings.communication != null) {
      totalCommunication += f.ratings.communication;
      countCommunication++;
    }
    if ((f.ratings as ratings).quality != null) {
      totalProduct += (f.ratings as ratings).quality;
      countProduct++;
    }
  });

  const recommendCount = feedbacks.filter(f => f.wouldRecommend).length;
  const recommendationRate = (recommendCount / total) * 100;

  const respondedCount = feedbacks.filter(f => f.status === "responded").length;
  const responseRate = (respondedCount / total) * 100;

  return {
    totalFeedbacks: total,
    ratings: {
      overall: { average: Number((totalOverall / countOverall).toFixed(2)), count: countOverall },
      service: { average: Number((totalService / countService).toFixed(2)), count: countService },
      quality: { average: Number((totalQuality / countQuality).toFixed(2)), count: countQuality },
      communication: { average: Number((totalCommunication / countCommunication).toFixed(2)), count: countCommunication },
      product: { average: Number((totalProduct / countProduct).toFixed(2)), count: countProduct }
    },
    recommendationRate: Number(recommendationRate.toFixed(2)),
    responseRate: Number(responseRate.toFixed(2))
  };
}


function getRatingDistribution(feedbacks: FeedbackItem[]) {
  // Initialize counts as string keys so it matches your expected output format
  const counts: Record<'1' | '2' | '3' | '4' | '5', number> = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0
  };

  let totalSum = 0;

  feedbacks.forEach(fb => {
    const star = Math.round(fb.ratings.overall) as 1 | 2 | 3 | 4 | 5;
    counts[String(star) as keyof typeof counts] += 1;
    totalSum += fb.ratings.overall;
  });

  const totalReviews = feedbacks.length;

  const percentages: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: totalReviews ? ((counts['1'] / totalReviews) * 100).toFixed(1) + "%" : "0%",
    2: totalReviews ? ((counts['2'] / totalReviews) * 100).toFixed(1) + "%" : "0%",
    3: totalReviews ? ((counts['3'] / totalReviews) * 100).toFixed(1) + "%" : "0%",
    4: totalReviews ? ((counts['4'] / totalReviews) * 100).toFixed(1) + "%" : "0%",
    5: totalReviews ? ((counts['5'] / totalReviews) * 100).toFixed(1) + "%" : "0%"
  };

  const averageRating = totalReviews > 0 ? parseFloat((totalSum / totalReviews).toFixed(1)) : 0;

  return {
    counts,
    percentages,
    totalReviews,
    averageRating
  };
}



interface FeedbackListProps {
  filteredFeedbacks: FeedbackItem[];
  itemsPerPage?: number;
  loadingDelay?: number;
}

function FeedbackList({ 
  filteredFeedbacks, 
  itemsPerPage = 5, 
  loadingDelay = 300 
}: FeedbackListProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Update hasMore when filtered feedbacks change
  useEffect(() => {
    setHasMore(visibleCount < filteredFeedbacks.length);
  }, [visibleCount, filteredFeedbacks.length]);

  // Reset when filteredFeedbacks changes (e.g., due to filtering)
  useEffect(() => {
    setVisibleCount(itemsPerPage);
    setIsLoading(false);
  }, [filteredFeedbacks, itemsPerPage]);

  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, loadingDelay));
    
    setVisibleCount(prev => {
      const newCount = prev + itemsPerPage;
      return Math.min(newCount, filteredFeedbacks.length);
    });
    
    setIsLoading(false);
  }, [isLoading, hasMore, loadingDelay, itemsPerPage, filteredFeedbacks.length]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '20px'
      }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItems, hasMore, isLoading]);

  const handleAction = (id: string, actionType: string) => {
    console.log(`Action "${actionType}" triggered for feedback ID: ${id}`);
  };

  const visibleFeedbacks = filteredFeedbacks.slice(0, visibleCount);

  // Show message when no feedbacks available
  if (filteredFeedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No feedback found</div>
        <div className="text-gray-400 text-sm">Try adjusting your filters or check back later.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feedback Items */}
      <div className="space-y-3">
        {visibleFeedbacks.map((feedback, index) => (
          <div 
            key={feedback.id}
            className="animate-fadeIn"
            style={{ 
              animationDelay: `${(index % itemsPerPage) * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <FeedbackCard
              feedback={feedback}
              onAction={handleAction}
            />
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading more feedback...</span>
          </div>
        </div>
      )}

      {/* Load More Trigger */}
      {hasMore && !isLoading && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-4"
        >
          <div className="text-gray-400 text-sm">
            Scroll down for more...
          </div>
        </div>
      )}

      {/* End Message */}
      {!hasMore && filteredFeedbacks.length > 0 && (
        <div className="text-center py-6 border-t border-gray-100">
          <div className="text-gray-500 text-sm mb-1">
            You&apos;ve reached the end!
          </div>
          <div className="text-gray-400 text-xs">
            Showing all {filteredFeedbacks.length} feedback{filteredFeedbacks.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {filteredFeedbacks.length > itemsPerPage && (
        <div className="sticky bottom-4 right-4 ml-auto w-fit">
          <div className="bg-white shadow-lg rounded-full px-3 py-1 text-xs text-gray-600 border">
            {Math.min(visibleCount, filteredFeedbacks.length)} of {filteredFeedbacks.length}
          </div>
        </div>
      )}
    </div>
  );
}



interface DoctorDashboardProps{
    doctorId:string
}

// Main Dashboard Component
const DoctorFeedback = ({doctorId}:DoctorDashboardProps) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[] >([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackItem[]>(feedbacks);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const result = getRatingDistribution(feedbacks);

    useEffect(()=>{
      fetchFeedbacks()
    },[doctorId])

    const fetchFeedbacks = async()=>{
        const res = await getAllFeedbacks(doctorId);
        console.log(res);

        if (Array.isArray(res)) {
        setFeedbacks(res);
        setFilteredFeedbacks(res);
        }

    }
    const stats = calculateDetailedFeedbackStats(feedbacks);
    const categoryBreakdown= [
      { category: "Service Quality", count: stats.ratings.service.count, avgRating: stats.ratings.service.average },
      { category: "Communication", count: stats.ratings.communication.count, avgRating: stats.ratings.communication.average },
      { category: "Overall Experience", count: stats.ratings.overall.count, avgRating: stats.ratings.overall.average },
      { category: "Product/Treatment", count: stats.ratings.quality.count, avgRating: stats.ratings.quality.average }
    ]
    const handleAction = (action: string, id: string) => {
      console.log(`Action: ${action} on feedback: ${id}`);
    };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(fb => 
        fb.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.feedback.toLowerCase().includes(searchTerm.toLowerCase()) 
        // fb.appointmentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(fb => fb.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(fb => {
        const avgRating = Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 4;
        return avgRating >= minRating;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'highest_rating':
          const avgA = Object.values(a.ratings).reduce((sum, val) => sum + val, 0) / 4;
          const avgB = Object.values(b.ratings).reduce((sum, val) => sum + val, 0) / 4;
          return avgB - avgA;
        case 'lowest_rating':
          const avgA2 = Object.values(a.ratings).reduce((sum, val) => sum + val, 0) / 4;
          const avgB2 = Object.values(b.ratings).reduce((sum, val) => sum + val, 0) / 4;
          return avgA2 - avgB2;
        default:
          return 0;
      }
    });

    setFilteredFeedbacks(filtered);
  };

  useEffect(() => {
    filterFeedbacks();
  }, [searchTerm, statusFilter, ratingFilter, sortBy]);

  return (
    <div className="w-full relative bg-gray-50">
      {/* Header */}
      <div className="bg-white w-full   border-b border-gray-200">
        <div className=" mx-auto px-4 h-[18vh] sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Patient Experience Insights </h1>
              <p className="text-gray-600 mt-1">View, analyze, and address patient feedback to improve care quality.</p>
            </div>
            {/* <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 cursor-pointer text-white rounded-lg hover:bg-teal-600 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className=" mx-auto h-[70vh] lg:h-[80vh] overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Feedback"
            value={stats.totalFeedbacks}
            icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
            trend="+12%"
            color="bg-blue-100"
          />
          <StatCard
            title="Average Rating"
            value={`${stats.ratings.overall.average}/5`}
            icon={<Star className="w-6 h-6 text-yellow-600" />}
            trend="+0.3"
            color="bg-yellow-100"
          />
          <StatCard
            title="Recommendation Rate"
            value={`${stats.recommendationRate}%`}
            icon={<ThumbsUp className="w-6 h-6 text-green-600" />}
            trend="+5%"
            color="bg-green-100"
          />
          <StatCard
            title="Response Rate"
            value={`${stats.responseRate}%`}
            icon={<Reply className="w-6 h-6 text-purple-600" />}
            trend="+8%"
            color="bg-purple-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend Chart */}
          <RatingTrendsChart data={analyticsData.monthlyTrend} />

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Category Breakdown</h3>
              <PieChart className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">{item.count}</div>
                    <div className="text-xs text-gray-500">{item.avgRating}/5</div>
                  </div>
                </div>
              ))}
              {/* <CategoryBarChart data={analyticsData.categoryBreakdown} /> */}
            </div>
          </div>
        </div>
 
        <RatingDistribution
          counts={result.counts}
          percentages={result.percentages}
          totalReviews={result.totalReviews}
          averageRating={result.averageRating}
        />


        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search feedback, patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="responded">Responded</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_rating">Highest Rating</option>
                <option value="lowest_rating">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Feedback ({filteredFeedbacks.length})
            </h2>
          </div>

          
          <FeedbackList filteredFeedbacks={filteredFeedbacks} />

          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No feedback found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorFeedback;