"use client"

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarApi, EventDropArg } from '@fullcalendar/core';
import { useEffect, useRef, useState } from 'react';
import { Appointment } from '@/app/types';
import { EventContentArg } from '@fullcalendar/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EventApi } from '@fullcalendar/core';
import { EventClickArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import toast from 'react-hot-toast';
import { rescheduleAppointment, updateAppointmentsByDoctor } from '@/lib/api';
import { Button } from './ui/button';

export type EventDataType = {
  id: string;  
  title: string;
  start: string;
  extendedProps: {
    time: string;
    status: string,
    patientId: string,
    age: string,
    blood: string,
    diagnosis: string,
    gender: string,
    phone: string,
    payment: string,
    triage: string,
  };
};

interface MyCalendarProps {
  scheduleData: Appointment[];
}

const MyCalendar = ({scheduleData}:MyCalendarProps)=>{
    const [events, setEvents] = useState<EventDataType[]>([]);
    const calendarRef = useRef<FullCalendar | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(()=>{
        const eventData: EventDataType[] = scheduleData.map((item: Appointment) => {
            const [startHour, startMinute, startPeriod] = item.time.split(/[:\s-]+/);
            let hour = parseInt(startHour);
            if (startPeriod === 'PM' && hour !== 12) hour += 12;
            if (startPeriod === 'AM' && hour === 12) hour = 0;

            const startDateTime = new Date(item.date);
            startDateTime.setHours(hour, parseInt(startMinute));
            const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
            return {
                id: item.id,
                title: item.patient,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                extendedProps: {
                    time: item.time,
                    status: item.status,
                    patientId: item.patientId,
                    age: item.age,
                    blood: item.blood,
                    diagnosis: item.diagnosis,
                    gender: item.gender,
                    phone: item.phone,
                    payment: item.payment,
                    triage: item.triage,
                }
            }
        });
        setEvents(eventData);
    },[scheduleData])

    const handleEventClick = (clickInfo: EventClickArg) => {
        setSelectedEvent(clickInfo.event);
        setIsDialogOpen(true);
    };

    const handleEventDrop = async (dropInfo: EventDropArg) => {
        const eventId = dropInfo.event.id;
        const startDate = new Date(dropInfo.event.startStr);
        let formattedTime = dropInfo.event.extendedProps.time;

        if (dropInfo.view.type.includes('timeGrid')) {
            const startTime = startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
            });

            const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
            const endTime = endDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
            });

            formattedTime = `${startTime} - ${endTime}`;
        }
        const newDate = startDate.toISOString().split('T')[0]; 
        try {
        const res = await rescheduleAppointment(eventId, newDate, formattedTime)
        if(res.ok){
            toast.success("Updated successfully");
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                event.id === eventId
                    ? {
                        ...event,
                        start: dropInfo.event.startStr,
                        extendedProps: {
                        ...event.extendedProps,
                        time: formattedTime
                        }
                    }
                    : event
                )
            );
        }else{
            toast.error("Failed to update")
        }
        } catch (error) {
            toast.error("Failed to update");
            dropInfo.revert(); 
        }
    };

    const handleWindowResize = () => {
        const calendarApi: CalendarApi | undefined = calendarRef.current?.getApi();
        if (calendarApi) {
        if (window.innerWidth < 768) {
            calendarApi.changeView('dayGridDay');
        } else {
            calendarApi.changeView('dayGridMonth');
        }
        }
    };

    const cancelHandler = async (id:string)=>{
        const res  = await updateAppointmentsByDoctor(id,"rejected")
        if(res.ok){
            toast.success("Appointment cancelled successfully.")
            setEvents((prev)=>prev.filter((appt)=>appt.id !== id))
            setIsDialogOpen(false)
        }else{
            toast.error("Failed to cancel appointment.")
            setIsDialogOpen(false)
        }
    }

    useEffect(() => {
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
    return(
        <div className="bg-white flex flex-col justify-center items-center p-6 rounded shadow-md w-full">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4">My Schedule</h3>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin,timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop} 
                eventDurationEditable={true}
                editable={true}
                eventContent={renderEventContent}
                headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                height="auto"
                contentHeight="auto"
                expandRows={true}
                fixedWeekCount={false}
                dayMaxEventRows={2}
                eventBackgroundColor="#14B8A6"
                eventBorderColor='#14B8A6'
                slotMinTime="08:00:00" 
                slotMaxTime="20:00:00" 
                slotDuration="00:30:00" 
                allDaySlot={false}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md rounded-lg shadow-lg bg-white">
                    <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-teal-500">
                        Appointment Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Here is the detailed information about this appointment.
                    </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-y-2">
                        <p className="font-semibold">Patient Name:</p>
                        <p>{selectedEvent.title}</p>

                        <p className="font-semibold">Date of Appointment:</p>
                        <p>{selectedEvent.start?.toLocaleString() || "No Date"}</p>

                        <p className="font-semibold">Status:</p>
                        <p>
                            <span
                            className={`px-2 py-1 text-xs rounded text-white ${
                                selectedEvent.extendedProps.status === "approved"
                                ? "bg-green-500"
                                : selectedEvent.extendedProps.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            >
                            {selectedEvent.extendedProps.status}
                            </span>
                        </p>

                        <p className="font-semibold">Age:</p>
                        <p>{selectedEvent.extendedProps.age}</p>

                        <p className="font-semibold">Blood Group:</p>
                        <p>{selectedEvent.extendedProps.blood}</p>

                        <p className="font-semibold">Diagnosis:</p>
                        <p>{selectedEvent.extendedProps.diagnosis}</p>

                        <p className="font-semibold">Gender:</p>
                        <p>{selectedEvent.extendedProps.gender}</p>

                        <p className="font-semibold">Phone:</p>
                        <p>{selectedEvent.extendedProps.phone}</p>

                        <p className="font-semibold">Payment:</p>
                        <p
                            className={`${
                            selectedEvent.extendedProps.payment === "Paid"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }`}
                        >
                            {selectedEvent.extendedProps.payment}
                        </p>

                        <p className="font-semibold">Triage:</p>
                        <span
                            className={`font-semibold border w-24 flex justify-center py-1 rounded-full ${
                            selectedEvent.extendedProps.triage === "Emergency"
                            ? "text-red-600 bg-red-100 px-2 border-red-500"
                            : selectedEvent.extendedProps.triage === "Non Urgent"
                            ? "text-yellow-500 bg-yellow-100 px-2 border-yellow-500"
                            : selectedEvent.extendedProps.triage === "Urgent"
                            ? "text-orange-500 bg-orange-100 px-2 border-orange-500"
                            : "text-gray-600 bg-gray-100 px-2 border-gray-600"
                        }`}
                        >{selectedEvent.extendedProps.triage}</span>
                        </div>
                        <Button onClick={()=>cancelHandler(selectedEvent.id)} variant="destructive" className='cursor-pointer'>
                            Cancel appointment
                        </Button>
                    </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}

const renderEventContent = (eventInfo: EventContentArg) => {
    const status = eventInfo.event.extendedProps.status;
    const badgeColor =
        status === 'approved'
        ? 'bg-green-500'
        : status === 'pending'
        ? 'bg-yellow-500'
        : status === 'rejected'
        ? 'bg-red-500'
        : 'bg-gray-400';

    return (
        <div className="p-2 w-full  rounded-sm shadow-lg bg-teal-50 border border-teal-500 text-xs break-words whitespace-normal">
            <p className="font-semibold text-gray-700 truncate whitespace-nowrap overflow-hidden">{eventInfo.event.title}</p>
            <p className="text-red-500 text-xs break-words whitespace-norma">{eventInfo.event.extendedProps.time}</p>
            {status && (
                <span className={`inline-block  mt-1 px-2 py-0.5 text-white text-[10px] rounded ${badgeColor}`}>
                    {status}
                </span>
            )}
        </div>
    );
};

export default MyCalendar