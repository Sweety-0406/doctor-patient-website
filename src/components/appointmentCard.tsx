"use client";

import { Appointment, FeedbackItem } from "@/app/types";
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
import RatingComponent from "./rating";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { generateHalfHourSlots } from "@/lib/utils";
import { getFeedbacksByPatient, getPrescriptionsByPatient, rescheduleAppointment } from "@/lib/api";
import toast from "react-hot-toast";
import RatingFeedback from "./reviews";
import { LuMessageSquareText, LuNotepadText } from "react-icons/lu";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { Pencil } from "lucide-react";


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
  const router = useRouter();
  const [newDate, setNewDate] = useState(data.date);
  const [newTime, setNewTime] = useState(data.time);
  const timeSlots = generateHalfHourSlots(8,20)

  const [open, setOpen] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [reason, setReason] = useState(""); 
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [isEdit, setIsEdit] = useState(false)

  const reshudleSumbitHandler = async (id: string, date:string, time:string)=>{
    const res = await rescheduleAppointment(id, date, time);
    if(res.ok ){
      toast.success("Appointment reshudled successfully")
      setShowRescheduleModal(false);
      onReschedule(id, date, time);
    }else{
      toast.error("Failed to reschedule the appointment.")
    }
  }


  useEffect(() => {
    if (data?.patientId && data?.id) {
      const fetchFeedback = async () => {
        const res = await getFeedbacksByPatient(data.patientId, data.id);
        console.log("res", res[0]);

        if (Array.isArray(res) && res.length > 0) {
          setFeedbacks(res);

          // Check if first feedback is less than 24 hours old
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



  // useEffect(() => {
  //   if(!openFeedback) return;
  //   console.log("openFeedback:", openFeedback, "data:", data);
  //   if (openFeedback && data?.patientId && data?.id) {
  //     const fetchFeedback = async () => {
  //       const res = await getFeedbacksByPatient(data.patientId, data.id);
  //       console.log("res2",res)
  //       if (Array.isArray(res)) {
  //         setFeedbacks(res);
  //         setIsEdit(res.length > 0);
  //       }
  //     };
  //     fetchFeedback();
  //   }
  // }, [openFeedback]);

  return (
    <div className="border border-teal-500 bg-gradient-to-b from-teal-100 to-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <img
          src={data.doctorImage}
          alt="Doctor"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col w-full">
          <h2 className="font-semibold">{data.doctorName}</h2>
          <div className="flex justify-between w-full ">
            <div>
              <p className="text-xs text-gray-500">Token no – <span className="font-mono">{data.id}</span></p>
              <p className="text-xs text-gray-500">
                {data.date} | <span className="text-blue-500">{data.time}</span>
              </p>
              <p className="text-xs text-gray-500">
                Payment |{" "}
                <span
                  className={`${
                    data.payment === "Paid" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {data.payment}
                </span>
              </p>
            </div>
            {(data.status == "pending" || data.status == "approved") && (
              <div onClick={()=>{
                setShowRescheduleModal(true)
              }} className="top-1 cursor-pointer">
                🗓️
              </div>    
            ) }
          </div>
          <p
            className={`text-xs font-semibold mt-1 ${
              data.status === "approved" && "text-green-600"
            } ${data.status === "pending" && "text-yellow-400"} ${
              data.status === "rejected" && "text-red-600"
            } ${data.status === "completed" && "text-blue-600"} `}
          >
            Consulting | {data.status.toUpperCase()}
          </p>
        </div> 
      </div>
      {isCompleted && (
        data.isPrescriptionAvailable ? (
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={() => router.push(`/patient/prescription/${data.id}`)}
            variant="green"
            className="flex-1 flex items-center gap-1"
          >
            <LuNotepadText className="size-4" />
            View prescription
          </Button>

          <Button
            onClick={() =>{
              if(isEdit){
                router.push(`/patient/appointment/feedback/${data.doctorId}/${data.id}?mode=edit`)
              }else{
                router.push(`/patient/appointment/feedback/${data.doctorId}/${data.id}?mode=create`)
              }
            }}
            variant="blue"
            className="flex-1 flex items-center gap-1"
          >
            <LuMessageSquareText className="size-4 mt-1" />
            {isEdit? "Edit feedback":"Give feedback"}
          </Button>
        </div>
        ) : (
          <div className="mt-4 text-sm text-red-500 flex gap-1 rounded-lg px-2 "> <FaExclamation className="bg-red-100 p-1 rounded-full size-5" /> No prescription available.</div>
        )
      )}
      {!isCompleted && (
        <>
          <button
            onClick={() => {
              if (isRejected || isCancelled) {
                router.push(`/patient/booking/appointment/${data.doctorId}`);
              } else {
                setOpen(true);
              }
            }}
            className={`mt-4 w-full text-sm py-2 rounded border cursor-pointer
          ${
            isRejected || isCancelled
              ? "border-gray-300 bg-teal-500 text-gray-700"
              : "border-red-500 text-white bg-red-500"
          }`}
          >
            {isRejected || isCancelled
              ? "Book Appointment"
              : "Cancel Appointment"}
          </button>

          {/* Cancel Confirmation Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cancel Appointment</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>Are you sure you want to cancel this appointment?</p>
                <Label className="mt-2 mb-1">Reason for cancellation</Label>
                <Input
                  placeholder="Reason for cancellation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <DialogFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setReason(""); 
                  }}
                  className="cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  disabled={!reason.trim()} 
                  onClick={async () => {
                    await onCancel(data.id, reason);
                    setOpen(false);
                    setReason(""); 
                  }}
                  className="cursor-pointer"
                >
                  Yes, Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {showRescheduleModal && (

            <Dialog  open={true} onOpenChange={setShowRescheduleModal}>
              <DialogContent >
                <DialogHeader className="border-b-2 pb-2 border-teal-600">
                  <DialogTitle>Reschedule Appointment</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    reshudleSumbitHandler(data.id, newDate, newTime);
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

          <Dialog open={openFeedback} onOpenChange={setOpenFeedback}>
            {/* <DialogTrigger asChild>
              <Button variant="outline">View Feedback</Button>
            </DialogTrigger> */}
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Patient Feedback</DialogTitle>
              </DialogHeader>

              {feedbacks.length === 0 ? (
                <p className="text-gray-500 text-sm">No feedback found.</p>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((fb) => {
                    const hoursDiff = differenceInHours(new Date(), new Date(fb.submittedAt));
                    const canEdit = hoursDiff < 24;

                    return (
                      <div
                        key={fb.id}
                        className="p-4 border rounded-lg shadow-sm bg-white space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{fb.patientName}</p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(fb.submittedAt), { addSuffix: true })}
                            </p>
                          </div>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                // Call your edit modal or navigate
                                console.log("Edit feedback", fb.id);
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                          )}
                        </div>

                        <div className="text-sm text-gray-700">{fb.feedback}</div>

                        <div className="text-xs text-gray-500">
                          Ratings: ⭐ {fb.ratings.overall}/5 (Service: {fb.ratings.service}, Quality: {fb.ratings.quality}, Communication: {fb.ratings.communication})
                        </div>

                        <div className="text-xs text-gray-500">Category: {fb.category}</div>
                        {fb.wouldRecommend && <div className="text-green-600 text-xs">✅ Would recommend</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </DialogContent>
          </Dialog>          

        </>
      )}
    </div>
  );
}
