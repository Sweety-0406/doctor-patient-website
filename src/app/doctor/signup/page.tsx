"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { doctorSignupSchema } from "@/lib/schemaValidation";
import Image from "next/image";
import { LuStethoscope } from "react-icons/lu";
import { doctorSignUp } from "@/lib/api";
import toast from "react-hot-toast";

type dataType = {
  name: string;
  email: string;
  password: string;
  specialization: string;
}

export default function DoctorSignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(doctorSignupSchema),
  });

  const onSubmit = async (data: dataType) => {
    const payload = {
      ...data,
      user: "doctor",
    };
    const res = await doctorSignUp(payload)
    if (res.ok) {
      toast.success("Signup successful");
      router.push("/doctor/login");
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
        <div className="w-full max-w-md bg-white p-10 rounded shadow">
          <h2 className="text-2xl  lg:text-4xl font-bold mb-6 text-center flex justify-center"><span onClick={()=>router.push("/")} className="font-bold cursor-pointer mt-[6px] mr-1 text-teal-500"><LuStethoscope /></span> Signup</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Specialization */}
            <div>
              <label className="text-teal-500 font-semibold text-lg" htmlFor="specialization">Specialization</label>
              <input
                {...register("specialization")}
                type="text"
                placeholder="e.g. Cardiologist"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 ${
                  errors.specialization ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>}
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
                <a href="/doctor/login" className="text-teal-500 font-medium">
                  Login
                </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
