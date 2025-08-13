// "use client"

// import Footer from "@/components/footer";
// import RatingFeedback from "@/components/reviews";
// import { usePatientAuth } from "@/context/patientAuthContext";
// import { useParams } from "next/navigation";

// interface PageProps {
//   params: {
//     doctorId: string;
//     appointmentId: string;
//   };
// }

// export default function AppointmentPage() {
//   // const docId = params.doctorId;
//   // const appId = params.appointmentId;
//   const {doctorId, appointmentId} = useParams()
//   const { patient, loading } = usePatientAuth();
  
//   if (loading || !patient) {
//     return <div>Loading...</div>;
//   }
  
//   return (
//     <div className=" max-h-screen mx-auto">
//         <div className="h-[90vh] overflow-y-scroll ">
//           <RatingFeedback patientId={patient.id} doctorId={doctorId as string} appointmentId={appointmentId as string} />
//         </div>
//         <div className="h-[10vh] p-4  lg:mx-10">
//             <Footer page="appointment" />
//         </div>
//     </div>
//   );
// }


"use client";

import Footer from "@/components/footer";
import RatingFeedback from "@/components/reviews";
import { usePatientAuth } from "@/context/patientAuthContext";
import { useParams, useSearchParams } from "next/navigation";

export default function AppointmentFeedbackPage() {
  const { doctorId, appointmentId } = useParams();
  const { patient, loading } = usePatientAuth();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (loading || !patient) {
    return <div>Loading...</div>;
  }

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
