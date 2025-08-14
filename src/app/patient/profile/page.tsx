"use client";

import { usePatientAuth } from "@/context/patientAuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { updatePatientProfile } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { MdNotificationsActive } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BsExclamationSquare } from "react-icons/bs";
import { FaUsersLine } from "react-icons/fa6";
import LoaderSection from "@/components/loader";
import ErrorSection from "@/components/error";


export default function PatientProfilePage() {
  const { patient, loading, logout, login } = usePatientAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: patient?.name || "",
    email: patient?.email || "",
    age: patient?.age || "",
    phone: patient?.phone || "",
    location: patient?.location || "",
    bloodGroup: patient?.bloodGroup || "",
    gender: patient?.gender || "",
  });

  useEffect(() => {
    if (!loading && !patient) {
      router.push("/patient/login");
    }
  }, [loading, patient]);

  if (loading || !patient) return <div className="text-center mt-10">Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const res = await updatePatientProfile(patient?.id,formData.name, formData.email, formData.age, formData.phone, formData.bloodGroup, formData.location, formData.gender )
    if(res.ok){
        const updatedPatient = await res.json()
        login(updatedPatient); 
        toast.success("Patient profile successfully updated")
    }else{
        toast.error("Updation failed")
    }
    setOpen(false);
  };

 const logoutHandler = ()=>{
    logout()
    router.push('/')
 }
   if (loading )
    return <LoaderSection />;

  if ( !patient)
    return <ErrorSection />;

  return (
    <div className="max-h-screen px-auto  min-h-screen    bg-gray-100">
      <div className="p-6 lg:px-[5%] w-full h-[90vh] overflow-y-scroll ">
        <div className="flex items-center space-x-3 mb-6">
        <h1 className="text-2xl font-bold">Patient Profile</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto lg:mt-10">
          {/* Profile Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-40 h-40 rounded-full border-4 border-teal-500 overflow-hidden bg-gray-200 flex items-center justify-center text-4xl mb-4">
              <Image
                  src={"/images/user.jpg"}
                  alt={patient.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
              />
              </div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-gray-400 text-sm">{patient.email}</p>
              <div className="flex gap-5">
                  <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                      <Button className="mt-4" variant="teal">Edit Profile</Button>
                  </DialogTrigger>

                  <DialogContent>
                      <DialogHeader className="border-b-2 border-teal-500 pb-2">
                      <DialogTitle>Edit Patient Profile</DialogTitle>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-4 py-4">
                          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                          <InputField label="Age" name="age" value={formData.age} onChange={handleChange} type="number" />
                          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
                          <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
                          <div>
                              <label className="font-semibold" htmlFor="gender">Gender</label>
                              <select
                              name="gender"
                              id="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="input w-full border rounded px-3 py-2"
                              required
                              >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              </select>
                          </div>
                      </div>

                      <DialogFooter>
                      <Button variant="teal" className="w-full" onClick={handleSave}>Save</Button>
                      </DialogFooter>
                  </DialogContent>
                  </Dialog>
                  <Button onClick={logoutHandler} className="mt-4 px-8" variant="teal">Logout</Button>
              </div>
          </div>

            {/* Details Section */}
            <div className="bg-white shadow-lg rounded-xl p-6 transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <ProfileDetail label="Age" value={patient.age} />
                <ProfileDetail label="Phone" value={patient.phone} />
                <ProfileDetail label="Location" value={patient.location} />
                <ProfileDetail label="Blood Group" value={patient.bloodGroup} />
                <ProfileDetail label="Gender" value={patient.gender} />
              </div>
            </div>
        </div> 
        <div onClick={()=>router.push("/patient/notificationPage")} className="transform transition-transform duration-300 hover:scale-105 text-teal-500 cursor-pointer bg-white mt-8 flex justify-between shadow-lg rounded-xl p-6">
          <div className="flex gap-4 "><span className="mt-[6px]"><MdNotificationsActive /></span>Notification</div>
          <div><MdOutlineKeyboardArrowRight className="size-7" /></div>
        </div>
        <div onClick={()=>router.push("/patient/helpAndSupport")} className="transform transition-transform duration-300 hover:scale-105 text-teal-500 cursor-pointer bg-white mt-4 flex justify-between shadow-lg rounded-xl p-6">
          <div className="flex gap-4"><span className="mt-[6px]"><BsExclamationSquare /></span>Help & Support</div>
          <div><MdOutlineKeyboardArrowRight className="size-7" /></div>
        </div>
        <div onClick={()=>router.push("/patient/inviteFriendsPage")} className="transform transition-transform duration-300 hover:scale-105 text-teal-500 cursor-pointer bg-white mt-4 flex justify-between shadow-lg rounded-xl p-6">
          <div className="flex gap-4"><span className="mt-[6px]"><FaUsersLine /></span>Invite Friends</div>
          <div><MdOutlineKeyboardArrowRight className="size-7" /></div>
        </div>
      </div>
      <div className="h-[10vh] px-6 lg:px[5%]">
          <Footer page="profile" />
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="font-semibold" htmlFor={name}>{label}</label>
      <Input name={name} id={name} value={value} onChange={onChange} type={type} />
    </div>
  );
}

function ProfileDetail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="text-teal-500 font-medium">{value || "N/A"}</p>
    </div>
  );
}
