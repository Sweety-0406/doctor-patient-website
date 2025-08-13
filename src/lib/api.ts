
import { Appointment, DoctoSignup, FeedbackItem, patientList, PatientSignup, Prescription } from "@/app/types";

// export const API_BASE ="http://localhost:3001"
export const API_BASE =process.env.NEXT_PUBLIC_BASE_API



//DOCTOR_APIS
export const getDoctors = () =>
  fetch(`${API_BASE}/doctors`).then(res => res.json());

export const getDoctorById = (id: string) =>
  fetch(`${API_BASE}/doctors/${id}`).then(res => res.json());

export const getDoctorByEmail = (email: string) =>
  fetch(`${API_BASE}/doctors?email=${email}`);

export const doctorSignUp = (payload: DoctoSignup) =>
  fetch(`${API_BASE}/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
});

export const doctorLogin = (email: string) =>
  fetch(`${API_BASE}/doctors?email=${email}`);

export const updateDoctorProfile = (id: string, name: string,email: string, specialization: string, qualification: string) =>
  fetch(`${API_BASE}/doctors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name,email, specialization, qualification }),
  });
 
export const getDoctorAppointments = async (doctorId: string) => {
  const res = await fetch(`${API_BASE}/appointments?doctorId=${doctorId}`);
  const data = await res.json();
  return data;
};

export const updateAppointmentsByDoctor = (id: string, status: string) =>
  fetch(`${API_BASE}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

export const rescheduleAppointment = (id: string,date:string, time: string, status?:string) =>
  fetch(`${API_BASE}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({date, time, status}),
  });

export const doctorChangePassword = (doctorId: string, newPassword: string) =>
  fetch(`${API_BASE}/doctors/${doctorId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: newPassword }),
  });

export const getMyPatientByDoctor = (id: string) =>
  fetch(`${API_BASE}/appointments?doctorId=${id}`);





//PATIENT_APIS

export const getPatientByEmail = (email: string) =>
  fetch(`${API_BASE}/patients?email=${email}`);

export const patientSignUp = (payload: PatientSignup) =>
  fetch(`${API_BASE}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

export const patientLogin = (email: string) =>
  fetch(`${API_BASE}/patients?email=${email}`);

export const getPatientById = (id: number) =>
  fetch(`${API_BASE}/patients/${id}`).then(res => res.json());

export const patientChangePassword = (patientId: string, newPassword: string) =>
  fetch(`${API_BASE}/patients/${patientId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: newPassword }),
  });

export const updatePatientProfile = (id: string, name: string,email: string, age: string, phone: string, bloodGroup: string, location:string, gender:string) =>
  fetch(`${API_BASE}/patients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name,email, age, phone, bloodGroup, location, gender }),
  });
   

export const getPatientAppointments = (id: string) =>
  fetch(`${API_BASE}/appointments?patientId=${id}`)

export const getAppointmentById = (id: string) =>
  fetch(`${API_BASE}/appointments?id=${id}`).then(res => res.json());

export const postAppointment = (data: Appointment) =>
  fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

export const cancelAppointment = (id: string, status: string, reason:string) =>
  fetch(`${API_BASE}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status,reason }),
});

export const addRating = (id: string, star: number) =>
  fetch(`${API_BASE}/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating: star }),
  });




  //PRESCRIPTIONS_API
export const getPrescriptions = (doctorId: string) =>
  fetch(`${API_BASE}/prescriptions?doctorId=${doctorId}`).then(res => res.json());

export const deletePrescription= async (id:string, appointmentId:string)=>{
  const res = await fetch(`${API_BASE}/prescriptions/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
    if (!res.ok) {
    throw new Error("Failed to create prescription");
  }

  // Step 2: Update the appointment if appointmentId is present
  if (appointmentId) {
    const appointmentRes = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPrescriptionAvailable: false }),
    });

    if (!appointmentRes.ok) {
      throw new Error("Prescription created, but failed to update appointment");
    }
  }

  return res;
}



type updatePrescriptionType = {
  id:string;
  medicines: {
    medicineName: string;
    dosage: string;
    duration: string;
    notes?: string | undefined;
  }[];
}
  
export const updatePrescription=(data: updatePrescriptionType)=>
  fetch(`${API_BASE}/prescriptions/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicines: data.medicines}),
  });

export const createPrescription = async (data: Prescription) => {
  // Step 1: Create the prescription
  const prescriptionRes = await fetch(`${API_BASE}/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!prescriptionRes.ok) {
    throw new Error("Failed to create prescription");
  }

  // Step 2: Update the appointment if appointmentId is present
  if (data.appointmentId) {
    const appointmentRes = await fetch(`${API_BASE}/appointments/${data.appointmentId}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPrescriptionAvailable: true }),
    });

    if (!appointmentRes.ok) {
      throw new Error("Prescription created, but failed to update appointment");
    }
  }

  return prescriptionRes;
};

export const getPrescriptionsByPatient = (appointmentId: string) =>
  fetch(`${API_BASE}/prescriptions?appointmentId=${appointmentId}`).then(res => res.json());


//PATIENT_LIST
export const getPatientListbyPatientId = (doctorId: string, patientId:string) =>
  fetch(`${API_BASE}/patientList?doctorId=${doctorId}&patientId=${patientId}`).then(res => res.json());

export const updatePatientList=(data: patientList)=>
  fetch(`${API_BASE}/patientList/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });



export const addPatientIfNotExists = async (
  patientData: patientList
) => {
  try {
    const existingPatient = await getPatientListbyPatientId(patientData.doctorId, patientData.patientId);

    if (existingPatient && existingPatient.length > 0) {
      console.log("Patient already exists, skipping add.");
      return { message: "Patient already exists", patient: existingPatient[0] };
    }

    const res = await fetch(`${API_BASE}/patientList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });

    if (!res.ok) throw new Error("Failed to add patient");

    const newPatient = await res.json();
    console.log("Patient added:", newPatient);

    return { message: "Patient added successfully", patient: newPatient };
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
};


//FEEDBACK_API

export const postFeedback = (data: FeedbackItem) =>
  fetch(`${API_BASE}/feedbacks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

export const updateFeedback = (id:string, data: FeedbackItem) =>
  fetch(`${API_BASE}/feedbacks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

export const getAllFeedbacks = (id: string) =>
  fetch(`${API_BASE}/feedbacks?doctorId=${id}`).then(res => res.json());

export const getFeedbackById = (doctorId: string, feedbackId: string) =>
  fetch(`${API_BASE}/feedbacks/${feedbackId}?doctorId=${doctorId}`).then(res => res.json());

export const changeStatusOfFeedback = (id: string, status: 'new' | 'reviewed' | 'responded') =>
  fetch(`${API_BASE}/feedbacks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: status }),
  });

export const getFeedbacksByPatient = (patientId: string, appointmentId: string) => {
  return fetch(`${API_BASE}/feedbacks?patientId=${patientId}&appointmentId=${appointmentId}`)
    .then((res) => res.json());
};

export const deleteFeedbackById = (id: string) =>
  fetch(`${API_BASE}/feedbacks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
