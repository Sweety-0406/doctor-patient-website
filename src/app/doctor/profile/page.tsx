"use client";

import { useDoctorAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { updateDoctorProfile } from "@/lib/api";
import toast from "react-hot-toast";

export default function DoctorProfilePage() {
  const { doctor, loading, login } = useDoctorAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !doctor) {
      router.push("/doctor/login");
    }
  }, [loading, doctor]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor?.name || "",
    email: doctor?.email || "",
    qualification: doctor?.qualification || "",
    specialization: doctor?.specialization || "",
  });

  if (loading || !doctor) return <div className="text-center mt-10">Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const res = await updateDoctorProfile(doctor.id, formData.name, formData.email, formData.specialization, formData.qualification)
    if (res.ok) {
      const updatedDoctor = await res.json(); 
      login(updatedDoctor); 
      toast.success("Profile updated successfully.")
    }
    setOpen(false);
  };

  return (
    <div className="max-h-screen min-h-screen overflow-y-scroll pt-20 lg:pt-0 flex bg-gray-50">
      <div className="p-6 w-full h-full ">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto lg:mt-20">
          {/* Profile Card */}
          <div className="bg-white transform transition-transform duration-300 hover:scale-105 shadow-lg rounded-xl p-6 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-500 mb-4">
              <Image
                src={doctor.image || "/images/patient.png"}
                alt={doctor.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <p className="text-green-500 mt-1">Certified Doctor</p>
            <p className="text-gray-400 text-sm mt-2">{doctor.email}</p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button  className="mt-4" variant="teal">Edit Profile</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader className="border-b-2 border-teal-500 pb-2">
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 pb-4">
                  <div>
                    <label className="font-semibold" htmlFor="name">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="font-semibold" htmlFor="email">Email</label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="font-semibold" htmlFor="specialization">Specialization</label>
                    <Input
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Specialization"
                    />
                  </div>
                  <div>
                    <label className="font-semibold" htmlFor="qualification">Qualification</label>
                    <Input
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="Qualification"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant={"teal"} className="w-full" onClick={handleSave}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bio and Details */}
          <div className="bg-white shadow-lg rounded-xl p-6 transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold mb-4">Bio & other details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <ProfileDetail label="Specialization" value={doctor.specialization} />
              <ProfileDetail label="Qualification" value={doctor.qualification} />
              <ProfileDetail label="Available Today" value={doctor.availableToday ? "Yes" : "No"} />
              <ProfileDetail label="Earliest Available" value={(doctor.earliestAvailable)} />
              <ProfileDetail label="Working Hours" value={doctor.timing} />
              <ProfileDetail label="Available On" value={doctor?.available?.join(", ") || ""} />
            </div>

            <div className="mt-6">
              <p className="font-semibold text-gray-400 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties?.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-teal-500 text-xs rounded-full">
                    #{s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-400 italic">&quot;{doctor.description}&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string | boolean }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="text-teal-500 font-medium">{value}</p>
    </div>
  );
}


