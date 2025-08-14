

"use client"

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  Heart, 
  MessageCircle, 
  ThumbsUp, 
  User,
  CheckCircle2,
  AlertCircle,
  Edit
} from 'lucide-react';
import { getAppointmentById, postFeedback, updateFeedback, getFeedbacksByPatient, deleteFeedbackById } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Appointment } from '@/app/types';

// TypeScript interfaces
interface RatingData {
  overall: number;
  service: number;
  quality: number;
  communication: number;
}

export interface FeedbackForm {
  name: string;
  email: string;
  rating: RatingData;
  feedback: string;
  category: string;
  wouldRecommend: boolean;
}

interface ExistingFeedback extends FeedbackForm {
  id: string;
  appointment: Appointment;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  patientName: string;
  patientEmail: string;
  ratings: RatingData;
  submittedAt: string;
  status: "new" | "reviewed" | "responded";
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

// Star Rating Component
const StarRating = ({ rating, onRatingChange, label, size = 'md' }:StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${sizeClasses[size]} cursor-pointer transition-all duration-200 hover:scale-110`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
          >
            <Star
              className={`w-full h-full transition-colors duration-200 ${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({hoverRating || rating}/5)
        </span>
      </div>
    </div>
  );
};

// Feedback Categories
const feedbackCategories = [
  { id: 'service', label: 'Service Quality', icon: ThumbsUp },
  { id: 'product', label: 'Product/Treatment', icon: Heart },
  { id: 'communication', label: 'Communication', icon: MessageCircle },
  { id: 'overall', label: 'Overall Experience', icon: Star }
];

interface RatingFeedbackProps {
  patientId: string,
  doctorId: string,
  appointmentId: string;
  mode?: 'create' | 'edit'; // Optional prop to specify mode
}

// Main Component
const RatingFeedback = ({ patientId, doctorId, appointmentId, mode = 'create' }: RatingFeedbackProps) => {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    rating: {
      overall: 0,
      service: 0,
      quality: 0,
      communication: 0
    },
    feedback: '',
    category: 'overall',
    wouldRecommend: false
  });

  const [existingFeedback, setExistingFeedback] = useState<ExistingFeedback | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(mode === 'edit');

  const fetchExistingFeedback = async () => {
    setIsLoading(true);
    try {
      const feedbackList = await getFeedbacksByPatient(patientId, appointmentId);
      console.log(feedbackList);

      if (Array.isArray(feedbackList) && feedbackList.length > 0) {
        const feedback = feedbackList[0]; // use first feedback
        setExistingFeedback(feedback);
        setFormData({
          name: feedback.patientName,
          email: feedback.patientEmail,
          rating: feedback.ratings,
          feedback: feedback.feedback,
          category: feedback.category,
          wouldRecommend: feedback.wouldRecommend
        });
        setIsEditMode(true);
      } else if (mode === "edit") {
        toast.error("No existing feedback found for this appointment");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      if (mode === "edit") {
        toast.error("Failed to load existing feedback");
        setIsEditMode(false);
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (mode === 'edit') {
      fetchExistingFeedback();
    } else {
      fetchExistingFeedback();
    }
  }, [appointmentId, patientId, mode]);

  const handleRatingChange = (category: keyof RatingData, rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: rating
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const appt = await getAppointmentById(appointmentId);
      
      if (Array.isArray(appt)) {
        if (isEditMode && existingFeedback) {
          const updatedPayload = {
            ...existingFeedback,
            patientName: formData.name,
            patientEmail: formData.email,
            ratings: formData.rating,
            feedback: formData.feedback,
            category: formData.category,
            wouldRecommend: formData.wouldRecommend,
            submittedAt: new Date().toISOString(),
            status: 'new' as "new" | "reviewed" | "responded" 
          };

          const res = await updateFeedback(existingFeedback.id, updatedPayload);
          if (res.ok) {
            setIsSubmitted(true);
            toast.success("Feedback updated successfully!");
          } else {
            toast.error("Failed to update feedback");
          }
        } else {
          const payload = {
            id: crypto.randomUUID(),
            appointment: appt[0],
            doctorId,
            patientId,
            appointmentId,
            patientName: formData.name,
            patientEmail: formData.email,
            ratings: formData.rating,
            feedback: formData.feedback,
            category: formData.category,
            wouldRecommend: formData.wouldRecommend,
            submittedAt: new Date().toISOString(),
            status: 'new' as "new" | "reviewed" | "responded"
          };

          const res = await postFeedback(payload);
          if (res.ok) {
            setIsSubmitted(true);
            toast.success("Feedback submitted successfully!");
          } else {
            toast.error("Failed to submit feedback");
          }
        }
      } else {
        toast.error("Something went wrong. Please try after some time.");
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("An error occurred while processing your feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const  handleDelete = async(id:string)=>{
    const res = await deleteFeedbackById(id)
    if(res.ok){
      toast.success("Feedback deleted successfully.")
      router.back()
    }else{
      toast.error("Something went wrong")
    }
  }

  const averageRating = Object.values(formData.rating).reduce((a, b) => a + b, 0) / 4;
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-[90vh] bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking for existing feedback...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="h-[90vh] bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been {isEditMode ? 'updated' : 'submitted'} successfully. We appreciate your time and input!
          </p>
          <div className="flex gap2 w-full">
            <Button
              onClick={() => router.back()}
              className="flex-1 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 cursor-pointer transition-colors"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-teal-700">
              {isEditMode ? 'Edit Your Feedback' : 'Rate Your Experience'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEditMode 
              ? 'Update your previous feedback and ratings.'
              : 'Your feedback helps us improve our services. Please take a moment to share your experience with us.'
            }
          </p>
          {isEditMode && existingFeedback && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                <strong>Last updated:</strong> {new Date(existingFeedback.submittedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-8">
          {/* Rating Overview Card */}
          <div className="">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-teal-500 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Overall Rating</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Service Quality</span>
                  <span>{formData.rating.service}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Product Quality</span>
                  <span>{formData.rating.quality}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Communication</span>
                  <span>{formData.rating.communication}/5</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2 text-teal-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {isEditMode ? 'Editing Mode' : 'Quick Tip'}
                  </span>
                </div>
                <p className="text-xs text-teal-600 mt-1">
                  {isEditMode 
                    ? 'You are updating your existing feedback'
                    : 'Detailed feedback helps us serve you better!'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Main Feedback Form */}
          <div className="">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Rate Your Experience
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <StarRating
                    rating={formData.rating.overall}
                    onRatingChange={(rating) => handleRatingChange('overall', rating)}
                    label="Overall Experience"
                    size="lg"
                  />
                  <StarRating
                    rating={formData.rating.service}
                    onRatingChange={(rating) => handleRatingChange('service', rating)}
                    label="Service Quality"
                  />
                  <StarRating
                    rating={formData.rating.quality}
                    onRatingChange={(rating) => handleRatingChange('quality', rating)}
                    label="Product/Treatment Quality"
                  />
                  <StarRating
                    rating={formData.rating.communication}
                    onRatingChange={(rating) => handleRatingChange('communication', rating)}
                    label="Communication"
                  />
                </div>
              </div>

              {/* Feedback Category */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {feedbackCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg border-2 transition-all ${
                          formData.category === category.id
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <span className="block text-sm text-center font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Text */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all"
                  placeholder="Please share your detailed feedback, suggestions, or concerns..."
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formData.feedback.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="recommend"
                    checked={formData.wouldRecommend}
                    onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                    className="w-5 h-5 cursor-pointer text-blue-600 rounded"
                  />
                  <label htmlFor="recommend" className="text-gray-700 font-medium">
                    I would recommend this service to others
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || averageRating === 0 || formData.name.trim() === '' || formData.email.trim() === ''}
                className={`w-full py-4 px-6 rounded-xl cursor-pointer font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting || averageRating === 0 || formData.name.trim() === '' || formData.email.trim() === ''
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditMode ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? <Edit className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    {isEditMode ? 'Update Feedback' : 'Submit Feedback'}
                  </>
                )}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => handleDelete(existingFeedback?.id as string)}
                  className="w-full transform hover:scale-105 shadow-lg hover:shadow-xl py-4 px-6 rounded-xl mt-2 bg-teal-600 hover:bg-teal-700 cursor-pointer font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RiDeleteBin5Line  className='size-5' /> Delete Feedback
                </button>
              )}
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full transform hover:scale-105 shadow-lg hover:shadow-xl py-4 px-6 rounded-xl mt-2 bg-teal-600 hover:bg-teal-700 cursor-pointer font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <BsBoxArrowInLeft className='size-5' /> Go Back
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingFeedback;