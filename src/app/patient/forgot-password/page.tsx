"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPatientByEmail, patientChangePassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [patientId, setPatientId] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await getPatientByEmail(email);
    const patients = await res.json();

    if (patients.length > 0) {
      setPatientId(patients[0].id);
      setStep("reset");
    } else {
      toast.error("No patient found with that email.");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    await patientChangePassword(patientId, newPassword)

    toast.success("Password updated successfully!");
    router.push("/patient/login");
  };

  return (
    <div className="flex h-screen px[10%] items-center justify-center bg-teal-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center  md:text-4xl mb-6">
          {step === "email" ? "Find Your Account" : "Reset Password"}
        </h2>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-none focus:ring-1  focus:ring-teal-500 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-none focus:ring-1  focus:ring-teal-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <a href="/doctor/login" className="text-teal-500 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
