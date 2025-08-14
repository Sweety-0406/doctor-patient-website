

"use client";

import ErrorSection from "@/components/error";
import Footer from "@/components/footer";
import LoaderSection from "@/components/loader";
import RatingFeedback from "@/components/reviews";
import { usePatientAuth } from "@/context/patientAuthContext";
import { useParams, useSearchParams } from "next/navigation";

export default function AppointmentFeedbackPage() {
  const { doctorId, appointmentId } = useParams();
  const { patient, loading } = usePatientAuth();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (loading )
    return <LoaderSection />;

  if ( !patient)
    return <ErrorSection />;

  return ( 
    <div className="max-h-screen mx-auto">
      <div className="h-[90vh] overflow-y-scroll">
        <RatingFeedback
          patientId={patient.id}
          doctorId={doctorId as string}
          appointmentId={appointmentId as string}
          mode={mode as "create" | "edit"}
        />
      </div>
      <div className="h-[10vh] p-4 lg:mx-10">
        <Footer page="appointment" />
      </div>
    </div>
  );
}
