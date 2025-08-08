import { Doctor } from "@/app/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export const capitalizeName=(name: string)=> {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatTime = (time: number): string => {
  const hour = Math.floor(time);
  const minutes = time % 1 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const generateHalfHourSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  let current = startHour;
  while (current < endHour) {
    const next = current + 0.5;
    const startLabel = formatTime(current);
    const endLabel = formatTime(next);
    slots.push(`${startLabel} - ${endLabel}`);
    current = next;
  }
  return slots;
};



const convertToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const docFormatTime = (minutes: number): string => {
  const hour = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${mins === 0 ? "00" : mins} ${ampm}`;
};

const docGenerateHalfHourSlots = (start: number, end: number): string[] => {
  const slots: string[] = [];
  for (let current = start; current < end; current += 30) {
    const next = current + 30;
    if (next > end) break;
    slots.push(`${docFormatTime(current)} - ${docFormatTime(next)}`);
  }
  return slots;
};

export const getNextAvailableSlot = ({
  available,
  startTime,
  endTime
}: {
  available: string[];
  startTime: string;
  endTime: string;
}): { date: string; slot: string; allSlots: string[] } => {
  const today = new Date();
  const currentMinutes = today.getHours() * 60 + today.getMinutes();

  const doctorStart = convertToMinutes(startTime);
  const doctorEnd = convertToMinutes(endTime);

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const checkDay = checkDate.getDay();

    const dayName = Object.keys(dayMap).find((key) => dayMap[key] === checkDay);

    if (dayName && available.includes(dayName)) {
      let slots = docGenerateHalfHourSlots(doctorStart, doctorEnd);

      if (i === 0 && currentMinutes > doctorStart) {
        slots = slots.filter((slot) => {
          const slotStartTime = slot.split(" - ")[0];
          const match = slotStartTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          if (!match) return false;

          let hour = parseInt(match[1], 10);
          const mins = parseInt(match[2], 10);
          const modifier = match[3].toUpperCase();
          if (modifier === "PM" && hour !== 12) hour += 12;
          if (modifier === "AM" && hour === 12) hour = 0;
          const slotMinutes = hour * 60 + mins;

          return slotMinutes > currentMinutes;
        });
      }

      if (slots.length > 0) {
        return {
          date: checkDate.toISOString().split("T")[0],
          slot: slots[0],
          allSlots: slots
        };
      }
    }
  }

  return { date: "", slot: "", allSlots: [] };
};


export const isDoctorAvailableToday = (available: string[]): boolean => {
  const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const todayName = Object.keys(dayMap).find(key => dayMap[key] === todayIndex);
  return todayName ? available.includes(todayName) : false;
};
