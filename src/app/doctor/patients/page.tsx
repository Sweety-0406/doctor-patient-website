

"use client";

import { useDoctorAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Appointment } from "@/app/types";
import { getMyPatientByDoctor } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VscEye } from "react-icons/vsc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import LoaderSection from "@/components/loader";
import ErrorSection from "@/components/error";

export default function PatientListPage() {
  const { doctor, loading } = useDoctorAuth();
  const [patients, setPatients] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !doctor) {
      router.push("/doctor/login");
    }
  }, [loading, doctor]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (doctor) {
        try {
          const res = await getMyPatientByDoctor(doctor.id);
          const data: Appointment[] = await res.json();
          setPatients(data);
        } catch (error) {
          console.error("Failed to fetch patients:", error);
        }
      }
    };
    fetchPatients();
  }, [doctor]);

  const uniquePatients = Array.from(
    new Map(patients.map((p) => [p.patientId, p])).values()
  );

  
  if (loading )
    return <LoaderSection />;

  if ( !doctor)
    return <ErrorSection />;

  return (
    <div className="max-h-screen min-h-screen pt-20 lg:pt-0 overflow-y-scroll">
      <div className="p-6 h-full">
        <h1 className="text-3xl font-bold mb-6">My Patients</h1>

        {uniquePatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full mt-10">
            <img
              src="/images/no-user-found.png"
              alt="No Patients"
              className="w-32 h-32 md:w-40 md:h-40 mb-4 opacity-70"
            />
            <span className="text-gray-500">No patients found.</span>
          </div>
        ) : (
          <div className="rounded-md overflow-hidden border bg-white">
            <Table className="overflow-hidden">
              <TableHeader className="bg-teal-500 ">
                <TableRow className="hover:bg-teal-500">
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniquePatients.map((p, idx) => (
                  <TableRow key={idx} className="bg-teal-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-teal-100 p-4  rounded-full">
                          <FaRegUser className="text-teal-500" />
                        </div>
                        {p.patient}
                      </div>
                    </TableCell>
                    <TableCell>{p.gender}</TableCell>
                    <TableCell>{p.age} yo</TableCell>
                    <TableCell>{p.diagnosis}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    <TableCell>{p.address}</TableCell>
                    <TableCell>{p.blood}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="bg-teal-100 hover:bg-teal-200 hover:text-teal-500 text-teal-500" asChild>
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="" align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(`/doctor/patients/${p.patientId}/appointments`)
                            }
                          >
                           Medical History  <VscEye className="text-teal-500" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(`/doctor/patients/${p.patientId}/profile`)
                            }
                          >
                             Profile  <VscEye className="text-teal-500" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
