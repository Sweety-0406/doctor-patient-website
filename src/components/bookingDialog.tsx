"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useEffect } from "react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string,
  title:string,
  description:string
}

export default function BookingDialog({ open, onOpenChange, imageSrc, title, description }: SuccessDialogProps) {
    useEffect(() => {
        if (open) {
        const timer = setTimeout(() => {
        onOpenChange(false);
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [open, onOpenChange]);
    return (
        <Dialog  open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm  w-sm rounded-2xl text-center p-6">
            <DialogHeader>
            <div className="flex justify-center">
                <Image
                    src={imageSrc} 
                    alt="Success"
                    width={250}
                    height={250}
                />
            </div>
            </DialogHeader>

            <h2 className="text-xl font-semibold mt-4">{title}</h2>

            <p className="text-gray-500 text-sm mt-3">
              {description}
            </p>
        </DialogContent>
        </Dialog>
    );
}
