export type AppointmentStatus = 'approved' | 'pending' | 'completed' | 'rejected' | 'cancelled';

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
  status: "approved" | "pending"  | "rejected" | "cancelled" | "completed" | string;
  rating: number
  reason?:string
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
  user: string,
  
}

export type PatientSignup = {
  name: string;
  email: string;
  password: string;
  location: string;
  user: string
}



