'use client';

import { useDoctorAuth } from '@/context/authContext';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFeedbackById } from '@/lib/api';
import { FeedbackItem } from '@/app/types';
import FeedbackDetailsModal from '@/components/feedback';

export default function IndividualFeedbackPage() {
  const { doctor, loading } = useDoctorAuth();
  const { feedbackId } = useParams();
  const [feedbackData, setFeedbackData] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    if (doctor && feedbackId) {
      fetchFeedbackDetail(doctor.id, feedbackId as string);
    }
  }, [doctor, feedbackId]);

  const fetchFeedbackDetail = async (docId: string, fbId: string) => {
    try {
      const res = await getFeedbackById(docId, fbId);
      console.log(res);
      setFeedbackData(res);
    } catch (err) {
      console.error('Failed to fetch feedback details:', err);
    }
  };

  if (loading) {
    return <div>loading...</div>;
  }

  if (!doctor) return null;

  return (
    <div className="pt-20 lg:pt-0 flex bg-white">
      {feedbackData == null ? (
        <div>loading...</div>
      ) : (
        <FeedbackDetailsModal feedbackData={feedbackData} />
      )}
    </div>
  );
}
