"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Appointment, patientList } from "@/app/types";
import { useDoctorAuth } from "@/context/authContext";
import { useParams, useRouter } from "next/navigation";
import { getDoctorAppointments, getPatientListbyPatientId, updatePatientList } from "@/lib/api";
import Image from "next/image";
import { format } from "date-fns";
import { FaArrowLeft, FaDumbbell } from "react-icons/fa";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import { FiPhoneCall } from "react-icons/fi";
import { IconType } from "react-icons";
import { FaDroplet, FaRegHeart } from "react-icons/fa6";
import { CiTempHigh } from "react-icons/ci";
import { RiPulseLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { LuCigarette } from "react-icons/lu";
import { GiWineGlass } from "react-icons/gi";
import { HiOutlineDocumentText, HiOutlineArrowDownTray } from "react-icons/hi2";


export default function PatientProfile() {
  const [patient, setPatient] = useState<patientList | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter()
  const { doctor, loading: doctorLoading } = useDoctorAuth();
  const { patientId } = useParams();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<patientList | null>(patient);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId || !doctor?.id) return;
      try {
        const res = await getPatientListbyPatientId(
          doctor.id,
          patientId as string
        );
        setPatient(res[0]);

        const appointmentRes = await getDoctorAppointments(doctor.id);
        const patientData = appointmentRes.filter((item: Appointment) => item.patientId === patientId)
        setAppointments(patientData);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!doctorLoading) fetchPatient();
  }, [patientId, doctor?.id, doctorLoading]);

  if (loading || doctorLoading) return <div>Loading...</div>;
  if (!patient) return <div>No patient found</div>;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editData) return;

    const files = Array.from(e.target.files);

    // Create formatted docs
    const newDocuments = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: `/docs/${file.name}`,
      uploadedAt: new Date().toISOString(),
    }));

    // Update local state immediately
    setEditData((prev) =>
      prev
        ? { ...prev, documents: [...(prev.documents || []), ...newDocuments] }
        : prev
    );
  };

  const handleSave = async() => {
    if(editData){
      const res = await updatePatientList(editData)
      if(res.ok){
        setPatient(editData);
        console.log(editData)
        setOpen(false);
        toast.success("Updated successfully")
      }else{
        setOpen(false);
        toast.success("Failed to update")
      }
    }
  };


  return (
    <div className=" mx-auto pt-20 lg:pt-0 relative max-h-screen ">
        <div className="space-y-6 p-4 ">
        {/* Top Profile Card */}
        <FaArrowLeft onClick={()=>router.back()} className="absolute cursor-pointer text-teal-500 size-8 left-10 md:left-6 top-28 md:top-24 lg:top-6" />
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
            {/* Left: Image + Name */}
            <div className="flex flex-col items-center justify-center  md:ml-8 md:items-start w-full md:w-1/3">
              <div className="relative">
                <Image
                  src={patient?.patientImage || "/images/avatar.png"}
                  alt={"patient-image"}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                {patient.status === "Active" && (
                  <div className="absolute p-3 border-2 left-20 top-24 border-white rounded-full bg-green-500" />
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold">{patient.patientName}</h2>
              <p className="text-gray-500">{patient.email}</p>
              <Button onClick={() => { setEditData(patient); setOpen(true); }} className="mt-3 flex gap-1 hover:scale-105 transition" variant="teal">
                <BiEditAlt />  Edit Profile
              </Button>
            </div>

            {/* Right: Patient Details */}
            <div className="grid grid-cols-2 gap-y-4 w-full md:w-2/3 text-sm">
            <Detail label="Gender" value={patient.gender} />
            <Detail label="Age" value={patient.age} />
            <Detail label="Blood" value={patient.blood} />
            {patient.status === "Active" ?(
              <Detail label="Status" style="bg-green-100 px-2 py-1 border border-green-500 rounded-full w-16" value={ "Active"} />
            ):(
              <Detail label="Status" style="bg-red-100 px-2 py-1 border border-red-500 rounded-full w-24" value={"Not Active"} />
            )}
            <Detail label="Department" value={patient.department} />
            <Detail label="Registered Date" value={format(new Date(patient.createdAt), "dd MMM yyyy")}  />
            <Detail label="Appointment" value={(appointments.length).toString()} />
            <Detail label="Bed Number" value={patient.bedNumber} />
            </div>
        </div>

          {/* Patient Additional Details */}
          <div className="space-y-6">
              {/* Contact & Personal */}
              <div>
                  <h3 className="font-semibold text-lg mb-3">Personal & Contact</h3>
                  <div className="bg-white border-l-2 border-teal-500 shadow rounded-xl p-6  text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                          <Detail label="Address" value={patient.address} />
                          <Detail label="Phone" value={patient.phone} />
                          <Detail label="Date of Birth" value={patient.dob ? format(new Date(patient.dob), "dd MMM yyyy") : undefined} />
                          <Detail label="Email" value={patient.email} />
                          <Detail label="Blood Group" value={patient.blood} />
                      </div>
                      <div className="bg-red-50 border border-red-200 p-2 rounded-lg mt-10">
                        <h3 className="font-semibold text-base  flex gap-1 text-red-500 mb-3"><FiPhoneCall className="size-5 mt-1" />Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                            <Detail label="Name" value={patient.emergencyContact?.name} />
                            <Detail label="Relation" value={patient.emergencyContact?.relation} />
                            <Detail label="Phone" value={patient.emergencyContact?.phone} />
                        </div>
                      </div>
                  </div>
              </div>

              {/* Patient Current Vitals */}
              <div>
                  <h3 className="font-semibold text-lg mb-3">Patient Current Vitals</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Blood Pressure */}
                    <VitalCard
                      color="red"
                      bg="bg-red-50"
                      icon={FaDroplet}
                      title="Blood Pressure"
                      value={patient.bloodPressure || "N/A"}
                      unit="mm/hg"
                      status={
                        patient.bloodPressure
                          ? (() => {
                              const [sys, dia] = patient.bloodPressure.split("/").map(Number);
                              return sys <= 120 && dia <= 80 ? "In the norm" : "Above the norm";
                            })()
                          : "N/A"
                      }
                      statusColor={
                        patient.bloodPressure
                          ? (() => {
                              const [sys, dia] = patient.bloodPressure.split("/").map(Number);
                              return sys <= 120 && dia <= 80
                                ? "text-green-500"
                                : "text-red-500";
                            })()
                          : "text-gray-500"
                      }
                    />

                    
                    {/* Glucose */}
                    <VitalCard
                      color="blue"
                      bg="bg-blue-50"
                      icon={RiPulseLine }
                      title="Glucose"
                      value={patient.glucose || "N/A"}
                      unit="mg/dl"
                      status={
                        patient.glucose
                          ? parseInt(patient.glucose) >= 70 && parseInt(patient.glucose) <= 140
                            ? "In the norm"
                            : "Above the norm"
                          : "N/A"
                      }
                      statusColor={
                        patient.glucose
                          ? parseInt(patient.glucose) >= 70 && parseInt(patient.glucose) <= 140
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }
                    />


                    {/* Heart Rate */}
                    <VitalCard
                      color="orange"
                      bg="bg-orange-50"
                      icon={FaRegHeart }
                      title="Heart Rate"
                      value={patient.heartRate || "N/A"}
                      unit="BPM"
                      status={
                        patient.heartRate
                          ? parseInt(patient.heartRate) >= 60 && parseInt(patient.heartRate) <= 100
                            ? "In the norm"
                            : "Above the norm"
                          : "N/A"
                      }
                      statusColor={
                        patient.heartRate
                          ? parseInt(patient.heartRate) >= 60 && parseInt(patient.heartRate) <= 100
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }
                    />

                    {/* Cholesterol */}
                    <VitalCard
                      color="green"
                      bg="bg-green-50"
                      icon={CiTempHigh }
                      title="Cholesterol"
                      value={patient.cholesterol || "N/A"}
                      unit="mg/dl"
                      status={
                        patient.cholesterol
                          ? parseInt(patient.cholesterol) < 200
                            ? "In the norm"
                            : "Above the norm"
                          : "N/A"
                      }
                      statusColor={
                        patient.cholesterol
                          ? parseInt(patient.cholesterol) < 200
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }
                    />
                  </div>
              </div>

              {/* Medical Info */}
              <div >
                  <h3 className="font-semibold text-lg mb-3">Medical Information</h3>
                  <div className="bg-white border-l-2 border-teal-500 shadow rounded-xl px-4 py-4 grid grid-cols-1  gap-4 text-sm">
                    {/* <div className="bg-teal-50 text-teal-800 p-2 border  rounded-lg">
                      <p className=" text-lg font-semibold">Allergies</p>
                      <ul className="ml-2">
                        {patient.allergies?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-teal-50 text-teal-800 p-2 border  rounded-lg">
                      <p className=" text-lg font-semibold">Chronic Conditions</p>
                      <ul className="ml-2">
                        {patient.chronicConditions?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-teal-50 text-teal-800 p-2 border  rounded-lg">
                      <p className=" text-lg font-semibold">Current Medications</p>
                      <ul className="ml-2">
                        {patient.currentMedications?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li> 
                        ))}
                      </ul>
                    </div> */}
{/* 


                    <div className="bg-red-50 text-red-800 p-2 border border-red-500 rounded-lg">
                      <p className=" text-lg font-semibold">Allergies</p>
                      <ul className="ml-2">
                        {patient.allergies?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 p-2 border border-yellow-500 rounded-lg">
                      <p className=" text-lg font-semibold">Chronic Conditions</p>
                      <ul className="ml-2">
                        {patient.chronicConditions?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-50 text-green-800 p-2 border border-green-500 rounded-lg">
                      <p className=" text-lg font-semibold">Current Medications</p>
                      <ul className="ml-2">
                        {patient.currentMedications?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li> 
                        ))}
                      </ul>
                    </div> */}



                    <div className="bg-green-50 text-green-800 p-2 border border-green-200 rounded-lg">
                      <p className=" text-lg font-semibold">Allergies</p>
                      <ul className="ml-2">
                        {patient.allergies?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-sky-50 text-sky-800 p-2 border border-sky-200 rounded-lg">
                      <p className=" text-lg font-semibold">Chronic Conditions</p>
                      <ul className="ml-2">
                        {patient.chronicConditions?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-50 text-green-800 p-2 border border-green-200 rounded-lg">
                      <p className=" text-lg font-semibold">Current Medications</p>
                      <ul className="ml-2">
                        {patient.currentMedications?.map((a:string,i:number)=>(
                          <li key={i} className={`flex gap-1 `}><GoDotFill className="mt-1" />{a}</li> 
                        ))}
                      </ul>
                    </div>





                  {/* <Detail style="bg-red-100 p-1 border border-red-500 rounded-lg" label="Allergies" value={patient.allergies?.join(", ")} />
                  <Detail label="Chronic Conditions" value={patient.chronicConditions?.join(", ")} />
                  <Detail label="Current Medications" value={patient.currentMedications?.join(", ")} /> */}
                  </div>
              </div>

              {/* Lifestyle */}
              <div>
                  <h3 className="font-semibold text-lg mb-3">Lifestyle</h3>
                  <div className="bg-white border-l-2 border-teal-500 shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* <div className="bg-teal-50 text-teal-800 p-2 flex gap-2 border  rounded-lg">
                      <LuCigarette className="size-5 mt-3"/>
                      <div>
                        <p className=" text-lg font-semibold flex">Smoking</p>
                        <p className={`flex gap-1 `}>{patient.lifestyle?.smoking ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div className="bg-teal-50 text-teal-800 p-2 flex gap-2 border  rounded-lg">
                      <GiWineGlass className="size-5 mt-3"/>
                      <div>
                        <p className=" text-lg font-semibold">Alcohol</p>
                        <p className={`flex gap-1 `}>{patient.lifestyle?.alcohol ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div className="bg-teal-50 text-teal-800 p-2 flex gap-2 border  rounded-lg">
                      <FaDumbbell className="size-5 mt-3"/>
                      <div>
                        <p className=" text-lg font-semibold">Exercise</p>
                        <p className={`flex gap-1 `}>{patient.lifestyle?.exercise ? `${patient.lifestyle?.exercise}` : "No exercise"}</p>
                      </div>
                    </div> */}
                    <div className="bg-green-50 border border-green-200 text-green-800 p-2 flex gap-2 border  rounded-lg">
                      <LuCigarette className="size-5 mt-3"/>
                      <div>
                        <p className=" text-lg font-semibold flex">Smoking</p>
                        <p className={`flex gap-1 `}>{patient.lifestyle?.smoking ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div className="bg-sky-50 border border-sky-200 text-sky-800 p-2 flex gap-2 border  rounded-lg">
                      <GiWineGlass className="size-5 mt-3"/>
                      <div>
                        <p className=" text-lg font-semibold">Alcohol</p>
                        <p className={`flex gap-1 `}>{patient.lifestyle?.alcohol ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 text-green-800 p-2 flex gap-2 border  rounded-lg">
                      <FaDumbbell className="size-5 mt-3"/>
                      <div>
                        <p className=" text-lg font-semibold">Exercise</p>
                        <p className={`flex gap-1 `}>{patient.lifestyle?.exercise ? `${patient.lifestyle?.exercise}` : "No exercise"}</p>
                      </div>
                    </div>
                  {/* <Detail label="Smoking" value={patient.lifestyle?.smoking ? "Yes" : "No"} />
                  <Detail label="Alcohol" value={patient.lifestyle?.alcohol ? "Yes" : "No"} />
                  <Detail label="Exercise" value={patient.lifestyle?.exercise} /> */}
                  </div>
              </div>

              {/* Insurance */}
              <div>
                  <h3 className="font-semibold text-lg mb-3">Insurance</h3>
                  <div className="bg-white border-l-2 border-teal-500 shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Detail label="Provider" value={patient.insurance?.provider} />
                  <Detail label="Policy Number" value={patient.insurance?.policyNumber} />
                  </div>
              </div>

              {/* Documents */}
              {/* {patient.documents && patient.documents.length > 0 && (
                  <div>
                  <h3 className="font-semibold text-lg mb-3">Documents</h3>
                  <div className="bg-white border-l-2 border-teal-500 shadow rounded-xl p-6 text-sm">
                      <ul className="list-disc list-inside">
                      {patient.documents.map((doc) => (
                          <li key={doc.id}>
                          {doc.url ? (
                              <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                              >
                              {doc.name}
                              </a>
                          ) : (
                              doc.name
                          )}
                          {doc.uploadedAt && (
                              <span className="text-gray-400 text-xs ml-2">
                              ({format(new Date(doc.uploadedAt), "dd MMM yyyy")})
                              </span>
                          )}
                          </li>
                      ))}
                      </ul>
                  </div>
                  </div>
              )} */}
            {
              patient.documents &&
              patient.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Documents</h3>
                  <div className="space-y-3">
                    {patient.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-white rounded-xl border-l-2 border-teal-500 shadow-sm p-4 hover:shadow-md transition"
                      >
                        {/* Left side: Icon + file info */}
                        <div className="flex items-center gap-3">
                          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
                            <HiOutlineDocumentText size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{doc.name}</p>
                            {doc.uploadedAt && (
                              <p className="text-xs text-gray-500">
                                Uploaded on{" "}
                                {format(new Date(doc.uploadedAt), "M/d/yyyy")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Download icon */}
                        {doc.url && (
                          <a
                            href={doc.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 transition"
                          >
                            <HiOutlineArrowDownTray size={20} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            }              
          </div>
        </div> 
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="p-4 overflow-auto">
            <SheetHeader>
              <SheetTitle>Edit Patient</SheetTitle>
            </SheetHeader>

            {editData !== null && (
              <div className="space-y-6 mt-4">
                
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibol text-lg text-teal-500 mb-2">Basic Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Name" value={editData.patientName} onChange={v => setEditData({ ...editData, patientName: v })} />
                    <InputField label="Email" value={editData.email} onChange={v => setEditData({ ...editData, email: v })} />
                    <InputField label="Phone" value={editData.phone} onChange={v => setEditData({ ...editData, phone: v })} />
                    <InputField label="Address" value={editData.address} onChange={v => setEditData({ ...editData, address: v })} />
                    <SelectField label="Gender" value={editData.gender} onChange={v => setEditData({ ...editData, gender: v })} options={["Male", "Female", "Other"]} />
                    <InputField label="Age" value={editData.age} onChange={v => setEditData({ ...editData, age: v })} />
                    <InputField label="DOB" type="date" value={editData.dob} onChange={v => setEditData({ ...editData, dob: v })} />
                    <InputField label="Blood Group" value={editData.blood} onChange={v => setEditData({ ...editData, blood: v })} />
                    <InputField label="Department" value={editData.department} onChange={v => setEditData({ ...editData, department: v })} />
                    <SelectField label="Status" value={editData.status} onChange={v => setEditData({ ...editData, status: v })} options={["Active", "Inactive"]} />
                    <InputField label="Bed Number" value={editData.bedNumber} onChange={v => setEditData({ ...editData, bedNumber: v })} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibol text-lg text-teal-500 mb-2"> Emergency Contact</h3>
                  {/* Emergency Contact */}
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label=" Name" value={editData?.emergencyContact?.name} onChange={v => setEditData({ ...editData, emergencyContact: { ...editData.emergencyContact, name: v } })} />
                    <InputField label="Relation" value={editData?.emergencyContact?.relation} onChange={v => setEditData({ ...editData, emergencyContact: { ...editData.emergencyContact, relation: v } })} />
                    <InputField label="Phone" value={editData?.emergencyContact?.phone} onChange={v => setEditData({ ...editData, emergencyContact: { ...editData.emergencyContact, phone: v } })} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibol text-lg text-teal-500 mb-2"> Current Vitals </h3>
                  {/* Current Vitals */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Blood-pressure" value={editData?.bloodPressure || ""} onChange={v => setEditData({ ...editData, bloodPressure: v})} />
                    <InputField label="Heart-rate" value={editData?.heartRate|| ""} onChange={v => setEditData({ ...editData, heartRate: v })} />
                    <InputField label="Glucose" value={editData?.glucose || ""} onChange={v => setEditData({ ...editData, glucose: v })} />
                    <InputField label="Cholesterol" value={editData?.cholesterol || ""} onChange={v => setEditData({ ...editData, cholesterol: v })} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibol text-lg text-teal-500 mb-2"> Allergies & Conditions</h3>
                  {/* Allergies & Conditions */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Allergies (comma separated)" value={editData?.allergies?.join(", ") || ""} onChange={v => setEditData({ ...editData, allergies: v.split(",").map(s => s.trim()) })} />
                    <InputField label="Chronic Conditions (comma separated)" value={editData?.chronicConditions?.join(", ") || ""} onChange={v => setEditData({ ...editData, chronicConditions: v.split(",").map(s => s.trim()) })} />
                    <InputField label="Current Medications (comma separated)" value={editData?.currentMedications?.join(", ") || ""} onChange={v => setEditData({ ...editData, currentMedications: v.split(",").map(s => s.trim()) })} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibol text-lg text-teal-500 mb-2">Lifestyle</h3>
                  {/* Lifestyle */}
                  <div className="grid grid-cols-3 gap-4">
                    <SelectField label="Smoking" value={editData?.lifestyle?.smoking ? "Yes" : "No"} onChange={v => setEditData({ ...editData, lifestyle: { ...editData.lifestyle, smoking: v === "Yes" } })} options={["Yes", "No"]} />
                    <SelectField label="Alcohol" value={editData?.lifestyle?.alcohol ? "Yes" : "No"} onChange={v => setEditData({ ...editData, lifestyle: { ...editData.lifestyle, alcohol: v === "Yes" } })} options={["Yes", "No"]} />
                    <InputField label="Exercise" value={editData?.lifestyle?.exercise} onChange={v => setEditData({ ...editData, lifestyle: { ...editData.lifestyle, exercise: v } })} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibol text-lg text-teal-500 mb-2"> Insurance</h3>
                  {/* Insurance */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Insurance Provider" value={editData?.insurance?.provider} onChange={v => setEditData({ ...editData, insurance: { ...editData.insurance, provider: v } })} />
                    <InputField label="Policy Number" value={editData?.insurance?.policyNumber} onChange={v => setEditData({ ...editData, insurance: { ...editData.insurance, policyNumber: v } })} />
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-medium mt-4">Documents</h3>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-500 rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A4.5 4.5 0 1115.9 6h.1a5 5 0 010 10h-8z"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-teal-700 font-medium">
                        Click to upload 
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (max. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </label>
                  <ul>
                    {editData?.documents?.map((doc) => (
                      <li key={doc.id} className="text-sm">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          {doc.name}
                        </a>{" "}
                        — {new Date(doc.uploadedAt ?? Date.now()).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-6 ">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button variant="teal" onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      
    </div>
  );
}


function InputField({ label, value, onChange, type = "text" }: { label: string; value?: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label className="mb-[4px]">{label}</Label>
      <Input type={type} value={value || ""} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label className="mb-1">{label}</Label>
      <Select  value={value} onValueChange={onChange}>
        <SelectTrigger className="border border-teal-500 cursor-pointer">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem  className="cursor-pointer hover:bg-teal-100" key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Detail({ label, value, style }: { label: string; value?: string, style?:string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className={`font-medium ${style}`}>{value || "N/A"}</p>
    </div>
  );
}



function VitalCard({
  icon: Icon,
  color,
  bg,
  title,
  value,
  unit,
  status,
  statusColor
}: {
  title: string;
  color: string;
  bg: string;
  value: string;
  unit: string;
  icon: IconType;
  status: string;
  statusColor: string;
}) {
  return (
    <div className={` border-l-4 hover:border-l-16 border-${color}-500 ${bg}  hover:scale-103 shadow hover:shadow-lg  cursor-pointer transition p-4 rounded-xl text-center`}>
      <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
        <Icon className={`text-${color}-500 text-lg`} />
        <span className="font-medium">{title}</span>
      </div>
      <h4 className="text-xl font-bold">
        {value}{" "}
        <span className="text-sm font-normal text-gray-500">{unit}</span>
      </h4>
      <p className={`text-xs mt-1 ${statusColor}`}>{status}</p>
    </div>
  );
}





