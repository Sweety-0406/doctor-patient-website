// "use client";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useRouter } from "next/navigation";
// import { doctorSignupSchema } from "@/lib/schemaValidation";
// import Image from "next/image";
// import { LuStethoscope } from "react-icons/lu";
// import { doctorSignUp } from "@/lib/api";
// import toast from "react-hot-toast";

// type dataType = {
//   name: string;
//   email: string;
//   password: string;
//   specialization: string;
// }

// export default function DoctorSignupPage() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(doctorSignupSchema),
//   });

//   const onSubmit = async (data: dataType) => {
//     const payload = {
//       ...data,
//       user: "doctor",
//     };
//     const res = await doctorSignUp(payload)
//     if (res.ok) {
//       toast.success("Signup successful");
//       router.push("/doctor/login");
//     }
//   };

//   return (
//     <div className="flex bg-teal-500 py-[5%] lg:py-10 xl:px-[20%] px-20 h-screen">
//       {/* Left Illustration */}
//       <div className="w-full  bg-gray-50 rounded-l-lg md:w-1/2 hidden md:flex items-center justify-center p-10">
//         <Image
//           src="/images/doctor.png" 
//           alt="Signup Illustration"
//           width={500}
//           height={500}
//           className="max-w-full h-auto"
//         />
//       </div>

//       {/* Right Signup Form */}
//       <div className="w-full md:pr-10 md:w-1/2 rounded-r-lg md:bg-gray-50 flex items-center justify-center">
//         <div className="w-full max-w-md bg-white p-10 rounded shadow">
//           <h2 className="text-2xl  lg:text-4xl font-bold mb-6 text-center flex justify-center"><span onClick={()=>router.push("/")} className="font-bold cursor-pointer mt-[6px] mr-1 text-teal-500"><LuStethoscope /></span> Signup</h2>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Name */}
//             <div>
//               <label className="text-teal-500 font-semibold text-lg" htmlFor="name">Name</label>
//               <input
//                 {...register("name")}
//                 type="text"
//                 placeholder="Enter your full name"
//                 className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
//                   errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
//                 }`}
//               />
//               {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-teal-500 font-semibold text-lg" htmlFor="email">Email</label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="Enter your email"
//                 className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
//                   errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
//                 }`}
//               />
//               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="text-teal-500 font-semibold text-lg" htmlFor="password">Password</label>
//               <input
//                 {...register("password")}
//                 type="password"
//                 placeholder="Enter your password"
//                 className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
//                   errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
//                 }`}
//               />
//               {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//             </div>

//             {/* Specialization */}
//             <div>
//               <label className="text-teal-500 font-semibold text-lg" htmlFor="specialization">Specialization</label>
//               <input
//                 {...register("specialization")}
//                 type="text"
//                 placeholder="e.g. Cardiologist"
//                 className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
//                   errors.specialization ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
//                 }`}
//               />
//               {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>}
//             </div>

//             <button
//               type="submit"
//               className="w-full cursor-pointer bg-teal-400 hover:bg-teal-500 text-white py-2 rounded transition"
//             >
//               Sign Up
//             </button>
//           </form>
//           <div>
//             <p className="text-center text-sm text-gray-500 mt-6">
//                 Already have an account ? 
//                 <a href="/doctor/login" className="text-teal-500 font-medium">
//                   Login
//                 </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
    // resolver: yupResolver(doctorSignupSchema) as unknown as Resolver<DoctorFormData>
// 






"use client";

import { useForm, Controller, SubmitHandler, Resolver, FieldPath } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { doctorSignupSchema } from "@/lib/schemaValidation";
import Image from "next/image";
import { LuStethoscope } from "react-icons/lu";
import { doctorSignUp } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DoctoSignup } from "@/app/types";

type DoctorFormData = {
  name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  specialties: string;
  phone: string;
  fees: string;
  timing: string;
  earliestAvailable: string;
  available: string[];
  description: string;
  startTime: string;
  endTime: string;
};


const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DoctorSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<DoctorFormData>({
    resolver: yupResolver(doctorSignupSchema) as unknown as Resolver<DoctorFormData>,
    defaultValues: {
      available: [],
    },
  });

  const onSubmit = async (data: DoctorFormData) => {

    if (data.startTime && data.endTime) {
      const formatted = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;
      data.timing = formatted;
    }
    const arrayOfSpecialties = data.specialties.split(",")
    const payload = { ...data, specialties:arrayOfSpecialties, user: "doctor",rating: 3.5, availableToday: true };
    console.log("Submitting Doctor Signup:", payload);

    const res = await doctorSignUp(payload);
    if (res.ok) {
      toast.success("Signup successful");
      router.push("/doctor/login");
    } else {
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: FieldPath<DoctorFormData>[] = [];

    if (step === 1) fieldsToValidate = ["name", "email", "password", "specialization"];
    if (step === 2) fieldsToValidate = ["qualification", "phone", "fees"];

    const valid = await trigger(fieldsToValidate );
    if (valid) setStep(step + 1);
    
  };

  const handlePrevious = () => setStep(step - 1);

  const formatTime = (time: string): string => {
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="flex bg-teal-500 py-[5%] lg:py-10 xl:px-[20%] px-20 h-screen">
      {/* Left Illustration */}
      <div className="w-full bg-gray-50 rounded-l-lg md:w-1/2 hidden md:flex items-center justify-center p-10">
        <Image
          src="/images/doctor.png"
          alt="Signup Illustration"
          width={500}
          height={500}
          className="max-w-full h-auto"
        />
      </div>

      {/* Right Signup Form */}
      <div className="w-full md:pr-10 md:w-1/2 rounded-r-lg md:bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-10 md:p-4 rounded shadow">
          <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-center flex justify-center">
            <span
              onClick={() => router.push("/")}
              className="font-bold cursor-pointer mt-[6px] mr-1 text-teal-500"
            >
              <LuStethoscope />
            </span>{" "}
            Signup
          </h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm text-center mb-2">
              Step {step} of 3
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit as SubmitHandler<DoctorFormData>)} className="space-y-2">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Name</label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.email && <p className="text-red-500  text-xs">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Password</label>
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.password && <p className="text-red-500  text-xs">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Specialization</label>
                    <input
                      {...register("specialization")}
                      type="text"
                      placeholder="e.g. Cardiologist"
                      className="w-full px-4 py-2 border rounded"
                      />
                      {errors.specialization && <p className="text-red-500  text-xs">{errors.specialization.message}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-teal-400 text-white py-2 rounded mt-4"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Qualification</label>
                    <input
                      {...register("qualification")}
                      type="text"
                      placeholder="e.g. MBBS"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.qualification && <p className="text-red-500 text-xs">{errors.qualification.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Specialties</label>
                    <input
                      {...register("specialties")}
                      type="string"
                      placeholder="e.g. child growth, therapy"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.specialties && <p className="text-red-500 text-xs">{errors.specialties.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Phone</label>
                    <input
                      {...register("phone")}
                      type="text"
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Fees</label>
                    <input
                      {...register("fees")}
                      type="text"
                      placeholder="e.g. ₹500"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.fees && <p className="text-red-500 text-xs">{errors.fees.message}</p>}
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-teal-400 text-white px-4 py-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Timing</label>
                    <div className="flex gap-4">
                      <input
                        type="time"
                        {...register("startTime")}
                        className="w-full px-4 py-2 border rounded"
                        onChange={(e) => {
                          const start = e.target.value;
                          const end = watch("endTime");
                          if (start && end) {
                            const formatted = `${formatTime(start)} - ${formatTime(end)}`;
                            setValue("timing", formatted);
                          }
                        }}
                      />
                      <input
                        type="time"
                        {...register("endTime")}
                        className="w-full px-4 py-2 border rounded"
                        onChange={(e) => {
                          const start = watch("startTime");
                          const end = e.target.value;
                          if (start && end) {
                            const formatted = `${formatTime(start)} - ${formatTime(end)}`;
                            setValue("timing", formatted);
                          }
                        }}
                      />
                    </div>
                    {errors.timing && <p className="text-red-500 text-xs">{errors.timing.message}</p>}
                    <input type="hidden" {...register("timing")} />
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Earliest Available</label>
                    <input
                      {...register("earliestAvailable")}
                      type="time"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.earliestAvailable && <p className="text-red-500 text-xs">{errors.earliestAvailable.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysList.map((day) => (
                        <label key={day} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" value={day} {...register("available")} />
                          {day}
                        </label>
                      ))}
                    </div>
                    {errors.available && <p className="text-red-500 text-xs">{errors.available.message}</p>}
                  </div>

                  <div>
                    <label className="text-teal-500 font-semibold text-lg">Description</label>
                    <textarea
                      {...register("description")}
                      placeholder="Brief about your experience"
                      className="w-full px-4 py-2 border rounded"
                    />
                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Previous
                    </button>
                    <button type="submit" className="bg-teal-400 text-white px-4 py-2 rounded">
                      Submit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
