

"use client";

import { Appointment } from "@/app/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaExclamation } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { generateHalfHourSlots } from "@/lib/utils";
import { getFeedbacksByPatient, rescheduleAppointment } from "@/lib/api";
import toast from "react-hot-toast";
import { LuMessageSquareText, LuNotepadText } from "react-icons/lu";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Hash, 
  CalendarClock,
  Stethoscope
} from "lucide-react";

export default function AppointmentCard({
  data,
  onCancel,
  onReschedule
}: {
  data: Appointment;
  onCancel: (id: string, reason: string) => void;
  onReschedule: (id: string, date: string, time: string) => void;
}) {
  const isRejected = data.status === "rejected";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isPending = data.status === "pending";
  const isApproved = data.status === "approved";
  
  const router = useRouter();
  const [newDate, setNewDate] = useState(data.date);
  const [newTime, setNewTime] = useState(data.time);
  const timeSlots = generateHalfHourSlots(8, 20);

  const [open, setOpen] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const reshudleSumbitHandler = async (id: string, date: string, time: string) => {
    const res = await rescheduleAppointment(id, date, time);
    if (res.ok) {
      toast.success("Appointment rescheduled successfully");
      setShowRescheduleModal(false);
      onReschedule(id, date, time);
    } else {
      toast.error("Failed to reschedule the appointment.");
    }
  };

  useEffect(() => {
    if (data?.patientId && data?.id) {
      const fetchFeedback = async () => {
        const res = await getFeedbacksByPatient(data.patientId, data.id);
        console.log("res", res[0]);

        if (Array.isArray(res) && res.length > 0) {
          const submittedTime = new Date(res[0].submittedAt).getTime();
          const now = Date.now();
          const diffHours = (now - submittedTime) / (1000 * 60 * 60);
          setIsEdit(diffHours < 24);
        } else {
          setIsEdit(false);
        }
      };
      fetchFeedback();
    }
  }, [data.patientId, data.id]);


  return (
    <div className={`relative overflow-hidden bg-white border border-teal-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}>

      <div className="p-4 py-6">
        {/* Doctor Information */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative">
            <img
              src={data.doctorImage}
              alt="Doctor"
              className="w-20 h-20 rounded-2xl object-cover border-3 border-teal-500 shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-teal-500 rounded-full p-1.5">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-gray-900 truncate">{data.doctorName}</h2>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Hash className="w-4 h-4 text-teal-500" />
                <span>Token:</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {data.id}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{data.date}</span>
                <Clock className="w-4 h-4 text-purple-500 ml-2" />
                <span className="font-semibold text-purple-600">{data.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Payment:</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                  data.payment === "Paid" 
                    ? "text-green-700 bg-green-100" 
                    : "text-red-700 bg-red-100"
                }`}>
                  {data.payment}
                </span>
              </div>
            </div>

            {/* Reschedule Option */}
            {(isPending || isApproved) && (
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="mt-3 cursor-pointer hover:underline hover:underline-2  flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200"
              >
                <CalendarClock className="w-4 h-4" />
                Reschedule
              </button>
            )}
          </div>
        </div>

        {isCompleted && (
          <div className="space-y-3">
            {data.isPrescriptionAvailable ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={() => router.push(`/patient/prescription/${data.id}`)}
                  className="cursor-pointer bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white border-0 rounded-lg py-5 font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-1">

                      <LuNotepadText className="w-5 h-5 mt-1" />
                    <div className="text-left">
                      <div className="font-semibold">View Prescription</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    if (isEdit) {
                      router.push(`/patient/appointment/feedback/${data.doctorId}/${data.id}?mode=edit`);
                    } else {
                      router.push(`/patient/appointment/feedback/${data.doctorId}/${data.id}?mode=create`);
                    }
                  }}
                  variant="blue"
                  className=" border cursor-pointer border-sky-500  rounded-lg py-5 font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-1">
                      <LuMessageSquareText className="w-5 h-5 mt-1" />
                    <div className="text-left">
                      <div className="font-semibold">
                        {isEdit ? "Edit Feedback" : "Give Feedback"}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaExclamation className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-red-800">No prescription available</div>
                  <div className="text-xs text-red-600">Please contact your doctor if needed</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button for Non-Completed Appointments */}
        {!isCompleted && (
          <div className="mt-4">
            <button
              onClick={() => {
                if (isRejected || isCancelled) {
                  router.push(`/patient/booking/appointment/${data.doctorId}`);
                } else {
                  setOpen(true);
                }
              }}
              className={`w-full cursor-pointer py-2 px-6 rounded-lg font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${
                isRejected || isCancelled
                  ? "bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white"
                  : "bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 text-white"
              }`}
            >
              {isRejected || isCancelled ? "Book New Appointment" : "Cancel Appointment"}
            </button>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader className="pb-4 border-b border-gray-100">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Cancel Appointment
              </DialogTitle>
            </DialogHeader>
            <div className="pb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this appointment with <strong>{data.doctorName}</strong>?
              </p>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Reason for cancellation <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Please provide a reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setReason("");
                }}
                className="rounded-lg cursor-pointer px-6"
              >
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                disabled={!reason.trim()}
                onClick={async () => {
                  await onCancel(data.id, reason);
                  setOpen(false);
                  setReason("");
                }}
                className="rounded-lg cursor-pointer px-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Yes, Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <Dialog open={true} onOpenChange={setShowRescheduleModal}>
            <DialogContent className="sm:max-w-lg rounded-2xl">
              <DialogHeader className="pb-4 border-b border-teal-100">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-teal-500" />
                  Reschedule Appointment
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  reshudleSumbitHandler(data.id, newDate, newTime);
                }}
                className="space-y-6 py-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Time Slot <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewTime(slot)}
                        className={`border cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          newTime === slot
                            ? "bg-teal-500 text-white border-teal-500 shadow-md"
                            : "border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Confirm Reschedule
                </button>
              </form>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}

