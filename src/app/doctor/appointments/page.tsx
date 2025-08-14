"use client";
import { Appointment, AppointmentStatus } from "@/app/types";
import { useDoctorAuth } from "@/context/authContext";
import { createPrescription, getDoctorAppointments, rescheduleAppointment, updateAppointmentsByDoctor } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { generateHalfHourSlots } from "@/lib/utils";
import PrescriptionForm, { PrescriptionFormValues } from "@/components/prescriptionForm";
import LoaderSection from "@/components/loader";
import ErrorSection from "@/components/error";

export default function AppointmentsPage() {
  const router = useRouter();
  const [selectedAppointment,setSelectedAppointment] = useState<Appointment | null>(null)
  const [showRescheduleModal,setShowRescheduleModal] = useState(false)
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointmentForPrescription, setSelectedAppointmentForPrescription] = useState<Appointment | null>(null);

  const [newDate, setNewDate] = useState( "");
  const [newTime, setNewTime] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { doctor, loading } = useDoctorAuth();
  const timeSlots = generateHalfHourSlots(8,20)

  useEffect(() => {
    if (!loading && !doctor) {
      router.push("/doctor/login");
    }
  }, [loading, doctor]);

  const fetchAppointments = async () => {
    if (doctor) {
      const res = await getDoctorAppointments(doctor.id);
      const data = res;
      
      const statusOrder: Record<AppointmentStatus, number> = {
      approved: 1,
      reschedule:2,
      pending: 3,
      completed: 4,
      rejected: 5,
      cancelled:6
    };

    const sortedAppointments = data.sort((a: { status: AppointmentStatus }, b: { status: AppointmentStatus }) => {
      return statusOrder[a.status] - statusOrder[b.status];
    });
      setAppointments(sortedAppointments);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctor]);

  const updateStatus = async (id: string, status: string) => {
    await updateAppointmentsByDoctor(id, status);
    fetchAppointments();
  };

  const handleReschedule = (appt: Appointment) => {
    setNewDate(appt.date)
    setNewTime(appt.time)
    setSelectedAppointment(appt);
    setShowRescheduleModal(true);
  };
  const reshudleSumbitHandler = async (id: string, date:string, time:string)=>{
    const res = await rescheduleAppointment(id, date, time, "reschedule");
    if(res.ok ){
      toast.success("Appointment reshudled successfully")
      setNewDate("")
      setNewTime("")
      setSelectedAppointment(null); 
      setShowRescheduleModal(false);
      await fetchAppointments();
    }else{
      toast.error("Failed to reschedule the appointment.")
    }
  }
  const handleGivePrescription = (appt: Appointment) => {
    setSelectedAppointmentForPrescription(appt);
    setShowPrescriptionModal(true);
  };
  const handlePrescriptionSubmit = async (data: PrescriptionFormValues) => {
    if (!selectedAppointmentForPrescription) return;
    
    const payload = {
      ...data,
      gender: selectedAppointmentForPrescription.gender,
      age: selectedAppointmentForPrescription.age,
      phone: selectedAppointmentForPrescription.phone,
      address: selectedAppointmentForPrescription.address,
      blood: selectedAppointmentForPrescription.blood,
      date: selectedAppointmentForPrescription.date,
      time: selectedAppointmentForPrescription.time,
      diagnosis:selectedAppointmentForPrescription.diagnosis ,
      patientImage:selectedAppointmentForPrescription.patientImage ,
      doctorImage:selectedAppointmentForPrescription.doctorImage ,
      patientId:selectedAppointmentForPrescription.patientId,
      doctorId:selectedAppointmentForPrescription.doctorId,
      appointmentId: selectedAppointmentForPrescription.id,
      patientName: selectedAppointmentForPrescription.patient,
      createdAt: new Date().toISOString(),
    };
 
    const res = await createPrescription(payload);
    if(res.ok){
      toast.success("Prescription added successfully!");
    }else{
      toast.error("Failed to add prescription!");
    }
    setShowPrescriptionModal(false);
    setSelectedAppointmentForPrescription(null);
  };



  if (loading )
    return <LoaderSection />;

  if ( !doctor)
    return <ErrorSection />;

  return (
    <div className="p-6 max-h-screen pt-24 lg:pt-4 overflow-y-scroll bg-gray-50 min-h-screen">
      {showPrescriptionModal && (
        <Dialog open={true} onOpenChange={setShowPrescriptionModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="text-teal-500">
              <DialogTitle className="text-xl">Add Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionForm onSubmit={handlePrescriptionSubmit} />
          </DialogContent>
        </Dialog>
      )}
      {showRescheduleModal && selectedAppointment && (
          <Dialog  open={true} onOpenChange={setShowRescheduleModal}>
            <DialogContent >
              <DialogHeader className="border-b-2 pb-2 border-teal-600">
                <DialogTitle>Reschedule Appointment</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  reshudleSumbitHandler(selectedAppointment.id, newDate, newTime);
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block mb-1 font-semibold">Select Time Slot</label>
                  <input
                    type="date"
                    value={newDate}
                    placeholder="new time"
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Select Time Slot</label>
                  <div className="grid grid-cols-3  gap-2">
                  {timeSlots.map((slot) => (
                      <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTime(slot)}
                      className={`border cursor-pointer hover:bg-teal-500 hover:text-white rounded px-2 py-1 text-sm ${newTime === slot ? 'bg-teal-500 text-white' : ''}`}
                      >
                      {slot}
                      </button>
                  ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-teal-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-teal-600"
                >
                  Confirm Reschedule
                </button>
              </form>
            </DialogContent>
          </Dialog>
      )}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-teal-400 text-gray-700">
              <th className="p-3">Patient</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action/Reason</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-gray-500">
                  <div className="flex flex-col items-center justify-center w-full">
                    <img
                      src="/images/no-user-found.png"
                      alt="No Patients"
                      className="w-32 h-32 md:w-40 md:h-40 mb-4 opacity-70"
                    />
                    <span>No appointments found.</span>
                  </div>
                </td>
              </tr>
            ) : (
              appointments.map((appt, index) => (
                <tr key={index} className="border-t bg-teal-50">
                  <td className="p-3 font-medium">{appt.patient}</td>
                  <td className="p-3">{appt.gender}</td>
                  <td className="p-3">{appt.date}</td>
                  <td className="p-3">{appt.time}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold
                        ${
                          appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : appt.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "completed"
                            ? "bg-sky-100 text-blue-700"
                            : appt.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : appt.status === "reschedule"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {(appt.status === "pending" || appt.status === "approved" || appt.status === "reschedule") ? (
                      <Dialog  open={openDialogId === appt.id} onOpenChange={(isOpen) => setOpenDialogId(isOpen ? appt.id : null)} >
                        <DialogTrigger asChild>
                          <button  className="text-sm cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded">
                            Take Action
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Take Action</DialogTitle>
                            <DialogDescription>
                              What would you like to do with this appointment?
                            </DialogDescription>
                          </DialogHeader>
                          {(appt.status === "approved" || appt.status === "reschedule") ?(
                            <div className="gap-4 flex ">
                              <button
                                onClick={() =>{
                                  updateStatus(appt.id, "completed")
                                  setOpenDialogId(null);
                                  toast.success("Appointment completed.")
                                }}
                                className="text-sm cursor-pointer bg-green-500  hover:bg-green-600 text-white px-3 py-1 rounded"
                              >
                                Completed
                              </button>
                              <button
                                onClick={() => {
                                  handleReschedule(appt)
                                  setOpenDialogId(null);
                                }}
                              
                                className="text-sm cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded"
                              >
                                Reschedule
                              </button>
                            </div>
                          ):(
                            <div className="flex gap-4 justify-center mt-4">
                              <button
                                onClick={() =>{
                                  updateStatus(appt.id, "approved")
                                  setOpenDialogId(null);
                                  toast.success("Appointment approved.")
                                }}
                                className="text-sm cursor-pointer bg-green-500 w-[84px] hover:bg-green-600 text-white px-3 py-1 rounded"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>{
                                  updateStatus(appt.id, "rejected")
                                  setOpenDialogId(null);
                                  toast.success("Appointment rejected.")
                                }}
                                className="text-sm cursor-pointer bg-red-500 w-[84px] hover:bg-red-600 text-white px-3 py-1 rounded"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  handleReschedule(appt)
                                  setOpenDialogId(null);
                                }}
                                className="text-sm cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded"
                              >
                                Reschedule
                              </button>
                            </div>
                          )}
                          
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        {appt.status === "cancelled" ? (
                          appt.reason || "No reason provided"
                        ) : appt.status === "completed" ? (
                          <button
                            onClick={() => handleGivePrescription(appt)}
                            className="text-sm cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded"
                          >
                             Prescription
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleReschedule(appt);
                              setOpenDialogId(null);
                            }}
                            className="text-sm cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded"
                          >
                            Reschedule
                          </button>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
