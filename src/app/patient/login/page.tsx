"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuStethoscope } from "react-icons/lu";
import { usePatientAuth } from "@/context/patientAuthContext";
import { patientLogin } from "@/lib/api";
import toast from "react-hot-toast";

type LoginForm = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function PatientLoginPage() {
  const { login } = usePatientAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    const res = await patientLogin(data.email);
    const patients = await res.json();

    const patient = patients[0];
    if (patient && patient.password === data.password) {
      login(patient);
      router.push("/patient/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen bg-teal-500 py-[5%]  px-[10%] xl:px-[20%]">
      {/* Left Illustration */}
      <div className="w-1/2 hidden bg-gray-50 rounded-l-lg  md:flex items-center   justify-center ">
        <Image
          src="/images/doctor.png" 
          alt="Login Illustration"
          width={500}
          height={500}
          className="max-w-full h-auto"
        />
      </div>

      {/* Right Login Form */}
      <div className="w-full md:pr-10 rounded-r-lg md:w-1/2 md:bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-10 md:p-4 rounded shadow">
          <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-center flex justify-center"><span onClick={()=>router.push("/")} className="font-bold cursor-pointer mt-[6px] mr-1 text-teal-500"><LuStethoscope /></span> Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div>
                <label className="text-teal-500 font-semibold text-lg" htmlFor="email">Email</label>
                <input
                    {...register("email")}
                    type="text"
                    placeholder="Enter your email ID"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-none focus:ring-1
                    ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500 '}`}
                />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className="text-teal-500 font-semibold text-lg" htmlFor="Password">Password</label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-none focus:ring-1
                    ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500 '}`}
                />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <a href="/patient/forgot-password" className="text-rose-500 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-teal-400 hover:bg-teal-500 text-white py-2 rounded transition"
            >
              Login
            </button>
          </form>
          <div>
            <p className="text-center text-sm text-gray-500 mt-6">
                Don&apos;t have an account ?
                <a href="/patient/signup" className="text-teal-500 font-medium">
                Sign Up
                </a>
            </p>
          </div>
          <div  className="bg-gray-100 text-sm p-1 rounded-md text-gray-500 mt-4">
            Demo credentials
            <p>email: riya@gmail.com</p>
            <p>password: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
