"use client";
import { useParams, useRouter } from "next/navigation";
import { getDoctorById, postAppointment } from "@/lib/api";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { usePatientAuth } from "@/context/patientAuthContext";
import { Doctor } from "@/app/types";
import { generateHalfHourSlots } from "@/lib/utils";



export default function BookingAppointmentPage() {
  const timeSlots = generateHalfHourSlots(8,20)
  const { patient, loading } = usePatientAuth();
  const { doctorId } = useParams(); 
  const router = useRouter()
  const [doc, setDoc] = useState<Doctor | null>(null);
  
  useEffect(() => {
      if (!doctorId) return;
      console.log(doctorId)
      const fetchData = async () => {
          const doctor = await getDoctorById(Number(doctorId));
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
    }
    const [formData, setFormData] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTimeSelect = (slot: string) => {
        setFormData({ ...formData, time: slot });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if(!doc) return null
        const payload = {
            doctorId: doctorId as string,
            patientId: String(patient?.id),
            doctorImage: doc.image,
            doctorName: doc.name,
            status: "pending" as const, 
            patient: formData.patient,
            gender: formData.gender as "Male" | "Female" | "Other",
            age: formData.age.toString(),
            diagnosis: formData.diagnosis,
            phone: formData.phone,
            address: formData.address,
            blood: formData.blood as "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | string,
            triage: formData.triage as "Non Urgent" | "Urgent" | "Emergency" | string,
            date: formData.date,
            time: formData.time,
            payment: formData.payment,
            id: crypto.randomUUID(),
            rating : 0,
        }
        e.preventDefault();
        console.log("Appointment Data:", payload);
        const res = await postAppointment(payload)
        if(res.ok){
            toast.success("Appointment booked successfully")
            setFormData(initialValue)
            router.push("/patient/appointment")
        }else{
            toast.error("Booking Failed Please Try Again")
        }
    };

    if (!doc) return <div>Loading...</div>;

    const convertTo24Hour = (time: string): number => {
    const [hourStr, modifier] = time.split(/(AM|PM)/i);
    let hour = parseInt(hourStr);
    if (modifier.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (modifier.toUpperCase() === "AM" && hour === 12) hour = 0;
    return hour;
    };

    // Check if slot is within the available time range
    const isSlotAvailable = (slot: string, availableStart: number, availableEnd: number) => {
    const slotStart = convertTo24Hour(slot.split(" - ")[0]);
    return slotStart >= availableStart && slotStart < availableEnd;
    };

    return (
        <div className="relative">
        <div className="bg-teal-500 w-full absolute h-40 rounded-b-4xl"/>
            <div className="absolute  p-4 w-full">
                <div className="mt-4">
                <h2 className="text-2xl text-white flex gap-4 font-semibold mb-10"><span className="cursor-pointer mt-1" onClick={()=>{router.back()}}><FaArrowLeft /></span>Book Your Appointment</h2>
                </div>
                <div className="flex justify-center w-full">
                    <div className="grid grid-cols-3  rounded-2xl mx-[10%] sm:px-8 bg-white shadow p-2">
                        <div className="col-span-2 sm:pr-4">
                        <h1 className="sm:text-xl font-semibold mb-1">{doc.name}</h1>
                        <p className="text-gray-500 text-xs mb-1 sm:text-base">{doc.specialization}</p>
                        <p className="text-teal-500 text-xs mb-1 sm:text-base">{doc.qualification}</p>
                        <p className="text-gray-500 text-xs mb-1 sm:text-base">Fellow of Sankara Natrayala, Chennai</p>
                        </div>
                        <div className="col-span-1">
                        <img 
                            src={doc.image}
                            alt={doc.name}
                            className="object-cover aspect-square rounded-2xl w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]"
                        />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="lg:mx-[5%] grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-auto p-4 space-y-4">
                <h2 className="col-span-1 md:col-span-2 lg:col-span-3 text-xl font-semibold">Book Appointment</h2>

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

                    <input type="date" name="date" onChange={handleChange} className="input" required />

                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block mb-1 text-sm font-semibold">Select Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => {
                        const availableRange = doc.available[0].split("|")[1].trim().split(" to ");
                        const availableStart = convertTo24Hour(availableRange[0]);
                        const availableEnd = convertTo24Hour(availableRange[1]);

                        const isAvailable = isSlotAvailable(slot, availableStart, availableEnd);

                        return (
                            <button
                            key={slot}
                            type="button"
                            onClick={() => isAvailable && handleTimeSelect(slot)}
                            className={`border border-teal-500 rounded px-2 py-1 text-sm ${
                                formData.time === slot ? 'bg-teal-500 text-white' : ''
                            } ${isAvailable ? 'hover:bg-teal-500 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            disabled={!isAvailable}
                            >
                            {slot}
                            </button>
                        );
                        })}
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
                                        The consultation fee is <span className="font-semibold text-teal-600">₹{doc.fees}</span>.  
                                        Would you like to proceed with the online payment?
                                        </p>
                                    </div>
                                    <DialogFooter className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, payment: "Paid" })
                                            toast.success("Pyment successful. You may close now.")
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
                    <button type="submit" className="cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white py-2 rounded">
                        Book Appointment
                    </button>
                </form>
            </div>

        </div>
    );
}




