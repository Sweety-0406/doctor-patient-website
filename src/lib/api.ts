
import { Appointment, DoctoSignup, PatientSignup } from "@/app/types";

// export const API_BASE ="http://localhost:3001"
export const API_BASE =process.env.NEXT_PUBLIC_BASE_API



//DOCTOR_APIS
export const getDoctors = () =>
  fetch(`${API_BASE}/doctors`).then(res => res.json());

export const getDoctorById = (id: number) =>
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
