
"use client";

import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface PrescriptionItem {
  prescriptionId: string;
  patientName: string;
  patientImage: string;
  diagnosis: string;
}

interface SidebarProps {
  prescriptions: PrescriptionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PrescriptionSidebar({ prescriptions, selectedId, onSelect }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-1/4 hidden md:flex flex-col bg-white border-r h-screen">
        {/* Header */}
        <div className="p-4 pt-24 lg:pt-4 border-b text-lg sm:text-xl lg:text-2xl font-bold text-teal-600">
          Prescriptions
        </div>

        {/* Search */}
        <div className="relative px-2 py-3">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-gray-500 px-4 pl-12 py-3 bg-gray-100 rounded-lg shadow-sm text-sm focus:border focus:outline-none focus:border-teal-400"
          />
          <span className="absolute left-6 top-5 text-gray-400">
            <IoSearchOutline className="size-5" />
          </span>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <ul className="space-y-2 pt-2">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm">No prescriptions found.</p>
            ) : (
              filtered.map((p) => (
                <li
                  key={p.prescriptionId}
                  onClick={() => onSelect(p.prescriptionId)}
                  className={`flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer transition ${
                    selectedId === p.prescriptionId
                      ? "bg-teal-500 border border-teal-500 text-white"
                      : "hover:bg-teal-100 hover:border border-gray-200"
                  }`}
                >
                  <img
                    src={p.patientImage || "/images/patient.png"}
                    alt={p.patientName}
                    width={50}
                    height={50}
                    className={`rounded-full hidden sm:block object-cover border-2  ${selectedId === p.prescriptionId ? "border-white":"border-teal-500"}`}
                  />
                  <div>
                    <p className="font-medium">{p.patientName}</p>
                    <p className={`text-xs ${selectedId === p.prescriptionId ? "text-white":"text-gray-500"}`}>{p.diagnosis || "No diagnosis"}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="md:hidden z-50 ">
        <Sheet>
          <SheetTrigger className="bg-teal-500 border-t cursor-pointer size-10  mt-20 fixed w-full text-white">
            Click to get all prescriptions
          </SheetTrigger>

          <SheetContent className="p-0">
            <SheetHeader className="px-4 pt-4 border-b-2">
              <SheetTitle className="text-xl font-semibold text-teal-600">
                All Prescriptions
              </SheetTitle>
            </SheetHeader>

            <div className="block md:hidden bg-white h-[calc(100vh-5rem)] overflow-y-auto px-4 pb-4">
              {/* Search Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-gray-500 px-4 pl-12 py-3 bg-gray-100 rounded-lg shadow-sm text-sm focus:border focus:outline-none focus:border-teal-400"
                />
                <span className="absolute left-3 top-3 text-gray-400">
                  <IoSearchOutline className="size-5" />
                </span>
              </div>

              {/* Prescription List */}
              <ul className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-gray-500 text-sm">No prescriptions found.</p>
                ) : (
                  filtered.map((p) => (
                    <li
                      key={p.prescriptionId}
                      onClick={() => onSelect(p.prescriptionId)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                        selectedId === p.prescriptionId
                          ? "bg-teal-50 border border-teal-500"
                          : "hover:bg-gray-100 hover:border border-gray-200"
                      }`}
                    >
                      <img
                        src={p.patientImage || "/images/patient.png"}
                        alt={p.patientName}
                        width={45}
                        height={45}
                        className="rounded-full  object-cover border-2 border-teal-500"
                      />
                      <div>
                        <p className="font-medium">{p.patientName}</p>
                        <p className="text-xs text-gray-500">{p.diagnosis || "No diagnosis"}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
