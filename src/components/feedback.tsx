import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Droplets,
  Activity,
  CreditCard,
  FileText,
  ThumbsUp,
  Mail,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  X,
  MessageSquare,
  Eye
} from 'lucide-react';
import { changeStatusOfFeedback, getFeedbackById } from '@/lib/api';
import { FeedbackItem } from '@/app/types';
import { FaArrowLeftLong, FaRegPenToSquare } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Custom Modal Component (replacing shadcn Dialog)


// TypeScript interfaces based on your data structure
interface AppointmentDetail {
  id: string;
  doctorId: string;
  patientId: string;
  doctorImage: string;
  doctorName: string;
  patientImage: string;
  status: string;
  patient: string;
  gender: string;
  age: string;
  diagnosis: string;
  phone: string;
  address: string;
  blood: string;
  triage: string;
  date: string;
  time: string;
  payment: string;
  rating: number;
  isPrescriptionAvailable: boolean;
  createdAt: string;
}

interface FeedbackDetail {
  id: string;
  appointment: AppointmentDetail;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  patientName: string;
  patientEmail: string;
  ratings: {
    overall: number;
    service: number;
    quality: number;
    communication: number;
  };
  feedback: string;
  category: string;
  wouldRecommend: boolean;
  submittedAt: string;
  status: string;
}

// Sample data based on your structure
const sampleFeedbackDetail: FeedbackDetail = {
  id: "b0a4d3e5-80b3-457f-bfd0-54cb2b33bde6",
  appointment: {
    id: "ba861f40-cb99-43c6-af8f-05f82bcd9508",
    doctorId: "680",
    patientId: "0121",
    doctorImage: "/images/download2.jpg",
    doctorName: "Dr. Aarti Sharma",
    patientImage: "/images/user.jpg",
    status: "completed",
    patient: "riya shah",
    gender: "Female",
    age: "23",
    diagnosis: "health issues",
    phone: "9876543690",
    address: "Kolkata",
    blood: "AB+",
    triage: "Non Urgent",
    date: "2025-08-09",
    time: "11:00 AM - 11:30 AM",
    payment: "Paid",
    rating: 3,
    isPrescriptionAvailable: true,
    createdAt: "2025-08-04T15:35:00.000Z"
  },
  doctorId: "680",
  patientId: "0121",
  appointmentId: "ba861f40-cb99-43c6-af8f-05f82bcd9508",
  patientName: "riya",
  patientEmail: "riya@gmail.com",
  ratings: {
    overall: 3,
    service: 4,
    quality: 5,
    communication: 5
  },
  feedback: "Doctors are great. They helped me alot.",
  category: "overall",
  wouldRecommend: true,
  submittedAt: "2025-08-13T11:47:42.285Z",
  status: "new"
};

// Star Rating Display Component
const StarRatingDisplay: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600 font-medium">{rating}/5</span>
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: X };
      case 'paid':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'unpaid':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <IconComponent className="w-4 h-4" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Triage Priority Badge
const TriageBadge: React.FC<{ triage: string }> = ({ triage }) => {
  const getTriageConfig = (triage: string) => {
    switch (triage.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'non urgent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getTriageConfig(triage)}`}>
      <Activity className="w-4 h-4" />
      {triage}
    </span>
  );
};

// Info Card Component
const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

// getFeedbackById
interface FeedbackDetailsModalProps{
    feedbackData:FeedbackItem
}

// Main Modal Component
const FeedbackDetailsModal = ({feedbackData}:FeedbackDetailsModalProps) => {  
  const router = useRouter()
  const averageRating = Object.values(feedbackData.ratings).reduce((a, b) => a + b, 0) / 4;
  const [status, setStatus] = useState(feedbackData.status)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusHandler = async(status:"new" | "reviewed" | "responded")=>{
    const res = await changeStatusOfFeedback(feedbackData.id,status )
    if(res.ok){
        toast.success("Change the status successfully.")
        setStatus(status)
    }else{
        toast.error("Something went wrong.")
    }
  }
  
    return (
        <div className="p-6 w-full max-h-[88vh] lg:max-h-screen overflow-y-scroll">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <div className="flex items-center gap-3">
                    <FaArrowLeftLong onClick={()=>router.back()}  className="size-8 cursor-pointer text-teal-600" />
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Feedback Details</h2>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 py-6">
            {/* Left Column - Doctor & Patient Info */}
            <div className="space-y-6">
                {/* Doctor Information */}
                <InfoCard 
                title="Doctor Information" 
                icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
                >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden">
                    {feedbackData.appointment.doctorImage ? (
                        <img 
                        src={feedbackData.appointment.doctorImage} 
                        alt="Doctor"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-8 h-8 text-blue-600" />
                    )}
                    </div>
                    <div>
                    <h4 className="font-semibold text-gray-800">{feedbackData.appointment.doctorName}</h4>
                    <p className="text-sm text-gray-600">ID: {feedbackData.appointment.doctorId}</p>
                    </div>
                </div>
                </InfoCard>

                {/* Patient Information */}
                <InfoCard 
                title="Patient Information" 
                icon={<User className="w-5 h-5 text-green-600" />}
                >
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center overflow-hidden">
                            {feedbackData.appointment.patientImage ? (
                            <img 
                                src={feedbackData.appointment.patientImage} 
                                alt="Patient"
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <User className="w-8 h-8 text-green-600" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 capitalize">{feedbackData.appointment.patient}</h4>
                            <p className="text-sm text-gray-600">ID: {feedbackData.appointment.patientId}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Phone:</span>
                            <p className="font-medium flex items-center gap-1">
                            <Phone className="w-4 h-4 text-blue-500" />
                            {feedbackData.appointment.phone}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500">Email:</span>
                            <p className="font-medium flex items-center gap-1">
                                <Mail className="w-4 h-4 text-orange-500" />
                                {feedbackData.patientEmail}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500">Address:</span>
                            <p className="font-medium flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-purple-500" />
                                {feedbackData.appointment.address}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500">Age:</span>
                            <p className="font-medium">{feedbackData.appointment.age} years</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Gender:</span>
                            <p className="font-medium">{feedbackData.appointment.gender}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Blood Type:</span>
                            <p className="font-medium flex items-center gap-1">
                            <Droplets className="w-4 h-4 text-red-500" />
                            {feedbackData.appointment.blood}
                            </p>
                        </div>
                    </div>
                    
                </div>
                </InfoCard>
            </div>

            {/* Right Column - Appointment Details */}
            <div className="space-y-6">
            {/* Appointment Information */}
            <InfoCard
                title="Appointment Details"
                icon={<Calendar className="w-5 h-5 text-purple-600" />}
            >
                <div className="grid sm:grid-cols-2 gap-1 md:gap-3 xl:gap-1">
                {/* Appointment ID */}
                <div className="col-span-2">
                    <span className="text-gray-500 text-sm  tracking-wide">
                    Appointment ID
                    </span>
                    <p className="font-mono text-sm bg-gray-50 px-3 py-1 rounded-lg border">
                    {feedbackData.appointment.id}
                    </p>
                </div>

                {/* Date */}
                <div>
                    <span className="text-gray-500 text-sm ">Date</span>
                    <p className="font-medium flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {formatDate(feedbackData.appointment.date)}
                    </p>
                </div>

                {/* Time */}
                <div>
                    <span className="text-gray-500 text-sm ">Time</span>
                    <p className="font-medium flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    {feedbackData.appointment.time}
                    </p>
                </div>

                {/* Diagnosis */}
                <div className="col-span-2">
                    <span className="text-gray-500 text-sm ">Diagnosis</span>
                    <p className="font-medium capitalize mt-1">
                    {feedbackData.appointment.diagnosis}
                    </p>
                </div>

                {/* Status & Triage */}
                <div>
                    <span className="text-gray-500 text-sm ">Status</span>
                    <div className="mt-1">
                    <StatusBadge status={feedbackData.appointment.status} />
                    </div>
                </div>
                <div>
                    <span className="text-gray-500 text-sm ">Triage</span>
                    <div className="mt-1">
                    <TriageBadge triage={feedbackData.appointment.triage} />
                    </div>
                </div>

                {/* Payment */}
                <div>
                    <span className="text-gray-500 text-sm ">Payment</span>
                    <div className="mt-1">
                    <StatusBadge status={feedbackData.appointment.payment} />
                    </div>
                </div>

                {/* Prescription */}
                <div>
                    <span className="text-gray-500 text-sm ">Prescription</span>
                    <div className="flex items-center gap-1 mt-1">
                    {feedbackData.appointment.isPrescriptionAvailable ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Available
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500">
                        <X className="w-4 h-4" />
                        Not Available
                        </span>
                    )}
                    </div>
                </div>

                {/* Created */}
                <div className="col-span-2 border-t pt-2 mt-2">
                    <span className="text-gray-500 text-xs ">Created</span>
                    <p className="text-sm mt-1">
                    {formatDate(feedbackData.appointment.createdAt)} at{" "}
                    {formatTime(feedbackData.appointment.createdAt)}
                    </p>
                </div>
                </div>
            </InfoCard>
            </div>

            </div>
            {/* Feedback Details */}
            <div className="space-y-6  "> 
                {/* Rating Overview */}
                <InfoCard 
                title="Rating Overview" 
                icon={<Star className="w-5 h-5 text-yellow-600" />}
                >
                <div className="space-y-4">
                    <div className="text-center items-center flex justify-center flex-col">
                    <div className="text-4xl font-bold text-teal-600 mb-2">{averageRating.toFixed(1)}</div>
                    <StarRatingDisplay rating={Math.round(averageRating)} size="lg" />
                    <p className="text-sm text-gray-600 mt-1">Overall Rating</p>
                    </div>
                    
                    <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Service Quality:</span>
                        <StarRatingDisplay rating={feedbackData.ratings.service} size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Treatment Quality:</span>
                        <StarRatingDisplay rating={feedbackData.ratings.quality} size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Communication:</span>
                        <StarRatingDisplay rating={feedbackData.ratings.communication} size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Experience:</span>
                        <StarRatingDisplay rating={feedbackData.ratings.overall} size="sm" />
                    </div>
                    </div>

                    {feedbackData.wouldRecommend && (
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-green-600">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium">Would Recommend</span>
                        </div>
                    </div>
                    )}
                </div>
                </InfoCard>

                {/* Feedback Content */}
                <InfoCard 
                    title="Patient Feedback" 
                    icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
                >
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{feedbackData.feedback || "No feedback text"}</p>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                            <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Submitted: {formatDate(feedbackData.submittedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Category: {feedbackData.category.charAt(0).toUpperCase() + feedbackData.category.slice(1)}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                            feedbackData.status === 'new' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            feedbackData.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-green-100 text-green-800 border-green-200'
                            }`}>
                            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </div>
                    </div>
                </InfoCard>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                {/* <button className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 mt-1" />
                  Reply to Patient
                </button> */}
                <button onClick={()=>statusHandler("reviewed")} className="px-4 cursor-pointer py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
                  <FaRegPenToSquare className="w-4 h-4"/>
                  Mark as Reviewed
                </button>
            </div>
        </div>
    );
};

export default FeedbackDetailsModal;