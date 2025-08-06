import * as Yup from "yup";

export const doctorLoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
});

// export const doctorSignupSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().min(6, " Atleast 6 character required.").required("Password is required"),
//   specialization: Yup.string().required("Specialization is required"),
// });


export const doctorSignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required(),
  specialization: Yup.string().required("Specialization is required"),
  qualification: Yup.string().required("Qualification is required"),
  specialties: Yup.string().required("Qualification is required"),
  // specialties: Yup.array().of(Yup.string().required()).min(1, "At least one specialty is required"),
  phone: Yup.string().required("Phone is required"),
  fees: Yup.string().required("Fees is required"),
  timing: Yup.string().required("Timing is required"),
  earliestAvailable: Yup.string().required("Earliest Available is required"),
  available: Yup.array().of(Yup.string().required()).min(1, "Select at least one day"),
  description: Yup.string().required("Description is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
});



export const patientLoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
});

export const patientSignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
  location: Yup.string().required("Age is required"),
});
