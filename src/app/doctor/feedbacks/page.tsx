'use client';

import { useDoctorAuth } from '@/context/authContext';
import DoctorFeedback from '@/components/doctorFeedback';

export default function FeedbackPage() {
  const { doctor, loading } = useDoctorAuth();


  if(loading){
    return(
        <div>loading...</div>
    )
  }

  if ( !doctor ) return null;

  return (
    <div className="min-h-screen max-h-screen pt-20 lg:pt-0 flex bg-white">
        <DoctorFeedback doctorId={doctor.id} />
    </div>
  );
}

