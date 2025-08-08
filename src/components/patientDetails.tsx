"use client"

import { capitalizeName } from "@/lib/utils";

interface PatientDetailsProps {
  name: string;
  image: string;
  diagnosis:string
}

export default function PatientDetails({ name, image,diagnosis }: PatientDetailsProps) {
  return (
    <div className="flex items-center gap-4 mb-6 mt-10 md:mt-0">
      <img src={image || "/images/patient.png"} alt={name} className="size-16 sm:size-20 border-3 border-teal-500 rounded-full object-cover" />
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500">{capitalizeName(name)}</h2>
        <p className="text-sm text-gray-500">{diagnosis}</p>
      </div>
    </div>
  );
}
