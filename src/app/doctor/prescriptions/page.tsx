"use client";

import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getPrescriptions,
  updatePrescription,
  deletePrescription as deleteAPI,
} from "@/lib/api";
import PrescriptionForm, { PrescriptionFormValues } from "@/components/prescriptionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { MdDeleteSweep } from "react-icons/md";
import { MdEditNote } from "react-icons/md";


interface Prescription {
  id: string;
  patientName: string;
  medicineName: string;
  dosage: string;
  duration: string;
  notes?: string;
  appointmentId: string;
  createdAt: string;
}

type GroupedPrescriptions = Record<string, Prescription[]>;

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [search, setSearch] = useState("");
  const [expandedPatients, setExpandedPatients] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const perPage = 10;

  const fetchPrescriptions = async () => {
    const res = await getPrescriptions();
    setPrescriptions(res);
  };

  const handleUpdate = async (data: PrescriptionFormValues) => {
    if (editing) {
      console.log(editing.id, data)
      const res = await updatePrescription(editing.id, data.medicineName, data.dosage, data.duration,data.notes);
      if (res.ok) {
        toast.success("Prescription updated successfully.");
      } else {
        toast.error("Failed to update prescription.");
      }
      setEditing(null);
      setOpen(false);
      fetchPrescriptions();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAPI(id);
    fetchPrescriptions();
    setConfirmDelete(null);
    toast.success("Prescription deleted.");
  };

  const handleEdit = (item: Prescription) => {
    setEditing(item);
    setOpen(true);
  };

  const togglePatientExpand = (name: string) => {
    setExpandedPatients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Search + Pagination
  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  const grouped: GroupedPrescriptions = filteredPrescriptions.reduce(
    (acc, curr) => {
      if (!acc[curr.patientName]) acc[curr.patientName] = [];
      acc[curr.patientName].push(curr);
      return acc;
    },
    {} as GroupedPrescriptions
  );


  const pageData: [string, Prescription[]][] = Object.entries(grouped).slice(
    (page - 1) * perPage,
    page * perPage
  );
  const totalPages = Math.ceil(Object.keys(grouped).length / perPage);

  return (
    <div className="min-h-screen max-h-screen pt-24 lg:pt-4 p-6 bg-gray-50 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Manage Prescriptions</h1>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by Patient or Medicine"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Prescription List */}
      <div className="bg-white p-4 rounded-xl shadow my-6 ">
        {pageData.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          pageData.map(([patientName, items]: [string, Prescription[]]) => (
            <div key={patientName} className="mb-4 border-b border-teal-500 pb-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => togglePatientExpand(patientName)}
              >
                <h2 className="font-semibol text-gray-500 text-lg">{patientName}</h2>
                {expandedPatients.includes(patientName) ? (
                  <FaChevronUp className="text-gray-500"/>
                ) : (
                  <FaChevronDown className="text-gray-500"/>
                )}
              </div>
              {expandedPatients.includes(patientName) && (
                <ul className="mt-2 space-y-3">
                  {items.map((item: Prescription) => (
                    <li
                      key={item.id}
                      className="border border-teal-500 rounded-lg p-4 shadow-sm hover:shadow-md transition  hover:scale-102 flex  md:flex-row justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.medicineName}</h3>
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">{item.dosage}</span> | {item.duration}
                        </p>
                        <p className="text-gray-600 text-sm mb-2 italic">{item.notes}</p>
                        <p className="text-xs text-gray-500">
                          Appointment ID:{" "}
                          <span className="font-medium text-gray-700">{item.appointmentId}</span> •{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Date: {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          // variant="teal"
                          onClick={() => handleEdit(item)}
                          className="border  flex gap-1 border-teal-500 rounded-full p-1 md:p-2 bg-teal-100 cursor-pointer hover:bg-teal-200  font-semibold"
                        >
                          <MdEditNote className="text-teal-500 size-4 md:size-5"/> 
                        </button>
                        <button
                          // variant="destructive"
                          onClick={() => setConfirmDelete(item.id)}
                          className="border flex gap-1 border-red-500 rounded-full p-1 md:p-2 bg-red-100 cursor-pointer hover:bg-red-200  font-semibold"
                        >
                          <MdDeleteSweep className="text-red-500 size-4 md:size-5 " /> 
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-4">
            <Button
              variant="teal"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="teal"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editing && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="text-teal-500 ">
              <DialogTitle className="text-xl">Edit Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionForm
              onSubmit={handleUpdate}
              defaultValues={editing}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this prescription? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(confirmDelete!)}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
