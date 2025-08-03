import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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