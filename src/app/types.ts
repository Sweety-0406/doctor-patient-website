export type AppointmentStatus = 'approved' | 'pending' | 'completed' | 'rejected' | 'cancelled' | 'reschedule';

export type Appointment = {
  id: string;
  doctorId: string;
  patientId: string;
  doctorImage: string;
  doctorName: string;
  patient: string;
  gender: "Male" | "Female" | "Other";
  age: string;
  diagnosis: string;
  phone: string;
  address: string;
  blood: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | string; 
  triage: "Non Urgent" | "Urgent" | "Emergency" | string; 
  date: string;  
  time: string; 
  payment: string;
  status: "approved" | "pending"  | "rejected" | "cancelled" | "completed" | "reschedule" | string;
  rating: number
  reason?:string
  patientImage?:string
  isPrescriptionAvailable:boolean
};


export type Doctor = {
  id: string;
  email: string;
  password: string;
  name: string;
  specialization: string;
  qualification: string;
  availableToday: boolean;
  image: string;
  description: string;
  specialties: string[];
  timing: string;
  startTime: string;
  endTime: string;
  earliestAvailable: string; 
  available: string[];
  user: "doctor" | string;
  rating: number,
  phone:string,
  fees: number
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  password: string;
  location: string;
  age?:string,
  phone?:string,
  bloodGroup?:string,
  gender?:string
};

export type DoctoSignup = {
  name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  specialties: string[];
  phone: string;
  fees: string;
  timing: string;
  earliestAvailable: string;
  available: string[];
  description: string;
  startTime: string;
  endTime: string;
};

export type PatientSignup = {
  name: string;
  email: string;
  password: string;
  location: string;
  user: string
}

export interface Prescription {
  doctorId:string;
  patientId:string;
  diagnosis:string;
  patientImage?:string;
  doctorImage?:string;
  patientName: string;
  appointmentId: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  blood: string;
  date: string;
  time: string;
  createdAt: string;
  medicines: {
      medicineName: string;
      dosage: string;
      duration: string;
      notes?: string | undefined;
  }[];
}

