"use client";

import { useParams, useRouter } from "next/navigation";
import { getDoctorById, postAppointment } from "@/lib/api";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { usePatientAuth } from "@/context/patientAuthContext";
import { Doctor } from "@/app/types";
import { dayMap, generateHalfHourSlots } from "@/lib/utils";

export default function BookingAppointmentPage() {
  const { patient } = usePatientAuth();
  const { doctorId } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    const fetchData = async () => {
      const doctor = await getDoctorById(doctorId as string);
      setDoc(doctor);
    };
    fetchData();
  }, [doctorId]);

  const initialValue = {
    patient: "",
    gender: "",
    age: "",
    diagnosis: "",
    phone: "",
    address: "",
    blood: "",
    triage: "",
    date: "",
    time: "",
    payment: "Not paid",
  };

  const [formData, setFormData] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (slot: string) => {
    setFormData({ ...formData, time: slot });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc) return null;

    const payload = {
      doctorId: doctorId as string,
      patientId: String(patient?.id),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      patientImage: patient?.image,
      patient: formData.patient,
      gender: formData.gender as "Male" | "Female" | "Other",
      age: formData.age.toString(),
      phone: formData.phone,
      address: formData.address,
      blood: formData.blood as "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | string,
      
      diagnosis: formData.diagnosis,
      doctorImage: doc.image,
      doctorName: doc.name,
      status: "pending" as const,
      triage: formData.triage as "Non Urgent" | "Urgent" | "Emergency" | string,
      date: formData.date,
      time: formData.time,
      payment: formData.payment,
      rating: 0,
      isPrescriptionAvailable:false
    };

    const patientListPayload={
      id: crypto.randomUUID(),
      doctorId: doctorId as string,
      patientId: String(patient?.id),
      createdAt: new Date().toISOString(),
      registeredDate: new Date().toISOString(),
      patientImage: patient?.image,
      patientName: formData.patient,
      gender: formData.gender as "Male" | "Female" | "Other",
      age: formData.age.toString(),
      phone: formData.phone,
      address: formData.address,
      blood: formData.blood as "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | string,
      status: "Active" 
    }
    
    const res = await postAppointment(payload);
    if (res.ok) {
      toast.success("Appointment booked successfully");
      setFormData(initialValue);
      router.push("/patient/appointment");
    } else {
      toast.error("Booking Failed. Please Try Again.");
    }
  };

  if (!doc) return <div>Loading...</div>;

  // ✅ Parse timing like "8:00 AM - 8:30 PM"
  const parseTiming = (timing: string): [string, string] => {
    const parts = timing
      .replace(/–|—/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .split("-")
      .map((t) => t.trim());

    if (parts.length !== 2) throw new Error(`Invalid timing format: ${timing}`);
    return [parts[0], parts[1]];
  };

  // ✅ Convert time string to decimal number (e.g., "08:30 AM" → 8.5)
  const convertTimeToNumber = (time: string): number => {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) throw new Error(`Invalid time format: ${time}`);

    let hour = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const modifier = match[3].toUpperCase();

    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;

    return hour + (minutes >= 30 ? 0.5 : 0);
  };



  // ✅ Doctor timing
  const [start, end] = parseTiming(doc.timing);
  const availableStart = convertTimeToNumber(start);
  const availableEnd = convertTimeToNumber(end);


  const timeSlots = generateHalfHourSlots(availableStart, availableEnd);

  return (
    <div className="relative">
      <div className="bg-teal-500 w-full absolute h-40 rounded-b-4xl" />
      <div className="absolute p-4 w-full">
        <div className="mt-4">
          <h2 className="text-2xl text-white flex gap-4 font-semibold mb-10">
            <span className="cursor-pointer mt-1" onClick={() => router.back()}>
              <FaArrowLeft />
            </span>
            Book Your Appointment
          </h2>
        </div>
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-3 rounded-2xl mx-[10%] sm:px-8 bg-white shadow p-2">
            <div className="col-span-2 sm:pr-4">
              <h1 className="sm:text-xl font-semibold mb-1">{doc.name}</h1>
              <p className="text-gray-500 text-xs mb-1 sm:text-base">{doc.specialization}</p>
              <p className="text-teal-500 text-xs mb-1 sm:text-base">{doc.qualification}</p>
              <p className="text-gray-500 text-xs mb-1 sm:text-base">
                Fellow of Sankara Natrayala, Chennai
              </p>
            </div>
            <div className="col-span-1">
              <img
                src={doc.image || "/images/doc.png"}
                alt={doc.name}
                className="object-cover aspect-square rounded-2xl w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]"
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:mx-[5%] grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-auto p-4 space-y-4"
        >
          <h2 className="col-span-1 md:col-span-2 lg:col-span-3 text-xl font-semibold">
            Book Appointment
          </h2>

          <input type="text" name="patient" placeholder="Patient Name" onChange={handleChange} className="input" required />

          <select name="gender" onChange={handleChange} className="input" required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="number" name="age" placeholder="Age" onChange={handleChange} className="input" required />

          <input type="text" name="diagnosis" placeholder="Diagnosis" onChange={handleChange} className="input" required />

          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="input" required />

          <input type="text" name="address" placeholder="Address" onChange={handleChange} className="input" required />

          <select name="blood" onChange={handleChange} className="input" required>
            <option value="">Select Blood Group</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
            <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
          </select>

          <select
            name="triage"
            onChange={handleChange}
            className="w-full border border-teal-500 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">Select Triage Level</option>
            <option>Non Urgent</option>
            <option>Urgent</option>
            <option>Emergency</option>
          </select>

          {/* <input type="date" name="date" onChange={handleChange} className="input" required /> */}
          <DatePicker className="input" placeholderText="Choose your appointment date"
            selected={formData.date ? new Date(formData.date) : null}
            onChange={(date: Date | null) => {
              if (!date) return;
              const dayIndex = date.getDay();
              const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayIndex);
              if (dayName && doc.available.includes(dayName)) {
                setFormData({ ...formData, date: date.toISOString().split("T")[0] });
              } else {
                toast.error("Doctor not available on this day");
              }
            }}
            filterDate={(date) => {
              const dayIndex = date.getDay();
              const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayIndex);
              return dayName ? doc.available.includes(dayName) : false;
            }}
            dateFormat="yyyy-MM-dd"
          />
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block mb-1 text-sm font-semibold">Select Time Slot</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot} 
                  type="button"
                  onClick={() => handleTimeSelect(slot)}
                  className={`border cursor-pointer border-teal-500 rounded px-2 py-1 text-sm ${
                    formData.time === slot ? "bg-teal-500 text-white" : ""
                  } hover:bg-teal-500 hover:text-white`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Payment</label>
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="bg-teal-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                  >
                    Pay Now
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Payment</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>
                      The consultation fee is{" "}
                      <span className="font-semibold text-teal-600">₹{doc.fees}</span>. Would you like
                      to proceed with the online payment?
                    </p>
                  </div>
                  <DialogFooter className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, payment: "Paid" });
                        toast.success("Payment successful. You may close now.");
                      }}
                      className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Confirm Payment
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, payment: "Not paid" })}
                className="bg-gray-300 cursor-pointer text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Pay Later
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
