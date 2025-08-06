"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { patientSignupSchema } from "@/lib/schemaValidation";
import Image from "next/image";
import { LuStethoscope } from "react-icons/lu";
import { patientSignUp } from "@/lib/api";
import toast from "react-hot-toast";

type dataType = {
    name: string;
    email: string;
    password: string;
    location: string;
}

export default function PatientSignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(patientSignupSchema),
  });

  const onSubmit = async (data: dataType) => {
    const payload = {
      ...data,
      user: "patient",
    };
    const res = await patientSignUp(payload);
    if (res.ok) {
      toast.success("Signup successful");
      router.push("/patient/login");
    }
  };

  return (
    <div className="flex bg-teal-500 py-[5%] lg:py-10 xl:px-[20%] px-20 h-screen">
      {/* Left Illustration */}
      <div className="w-full  bg-gray-50 rounded-l-lg md:w-1/2 hidden md:flex items-center justify-center p-10">
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
          <h2 className="text-2xl  lg:text-4xl font-bold mb-6 text-center flex justify-center"><span onClick={()=>router.push("/")} className="font-bold mt-[6px] cursor-pointer mr-1 text-teal-500"><LuStethoscope /></span> Signup</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Name */}
            <div>
              <label className="text-teal-500 font-semibold text-lg" htmlFor="name">Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-teal-500 font-semibold text-lg" htmlFor="email">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-teal-500 font-semibold text-lg" htmlFor="password">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="text-teal-500 font-semibold text-lg" htmlFor="age">Location</label>
              <input
                {...register("location")}
                type="text"
                placeholder="Enter your Location"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
                  errors.location ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-teal-400 hover:bg-teal-500 text-white py-2 rounded transition"
            >
              Sign Up
            </button>
          </form>
          <div>
            <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account ? 
                <a href="/patient/login" className="text-teal-500 font-medium">
                  Login
                </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
