'use client';

import { useDoctorAuth } from '@/context/authContext';
import DoctorFeedback from '@/components/doctorFeedback';
import LoaderSection from '@/components/loader';
import ErrorSection from '@/components/error';

export default function FeedbackPage() {
  const { doctor, loading } = useDoctorAuth();



  if (loading )
    return <LoaderSection />;

  if ( !doctor)
    return <ErrorSection />;

  return (
    <div className="min-h-screen max-h-screen pt-20 lg:pt-0 flex bg-white">
        <DoctorFeedback doctorId={doctor.id} />
    </div>
  );
}

