
"use client";

import { useEffect, useState } from "react";
import { useDoctorAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import PrescriptionSidebar from "@/components/prescriptionSidebar";
import PatientDetails from "@/components/patientDetails";
import PrescriptionList from "@/components/prescriptionList";
import { getPrescriptions, deletePrescription, updatePrescription } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import PrescriptionForm, { PrescriptionFormValues } from "@/components/prescriptionForm";
import { Button } from "@/components/ui/button";
import { FullPrescription } from "@/app/types";



export default function PrescriptionPage() {
  const { doctor, loading } = useDoctorAuth();
  const router = useRouter();
  const [allPrescriptions, setAllPrescriptions] = useState<FullPrescription[]>([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [editing, setEditing] = useState<FullPrescription | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);


  useEffect(() => {
    if (!loading && doctor) fetchData();
    else if (!loading && !doctor) router.push("/doctor/login");
  }, [loading, doctor]);

  const fetchData = async () => {
    if (!doctor) return;
    const res = await getPrescriptions(doctor.id);
    setAllPrescriptions(res);
    if (res.length > 0) setSelectedPrescriptionId(res[0].id);
  };

  const handleUpdate = async (data: PrescriptionFormValues) => {
    if (!editing) return;
    const payload = {
      id: editing.id,
      medicines: data.medicines
    }
    const res = await updatePrescription(payload);
    if(res.ok){
      toast.success("Prescription updated successfully.")
    }else{
      toast.error("Failed to update prescription.");
    }
    setOpen(false);
    fetchData();
  };
  const deleteModel = (id:string)=>{
    setConfirmDelete(id)
  }
  const handleDelete = async (id: string) => {
    console.log(id)
    const res = await deletePrescription(id, selectedPrescription?.appointmentId as string);
    if(res.ok){
      toast.success("Deleted precription successfully.")
      setConfirmDelete(null);
    }else{
      toast.error("Failded to delete prescription.");
    }
    fetchData();
  };

  const prescriptionList = allPrescriptions.map((p) => ({
    prescriptionId: p.id,
    patientName: p.patientName,
    patientImage: p.patientImage,
    diagnosis: p.diagnosis,
  }));

  const selectedPrescription = allPrescriptions.find((p) => p.id === selectedPrescriptionId);

  const handleEdit = () => {
    if(!selectedPrescription) return null
    setEditing(selectedPrescription);
    setOpen(true);
  };

  const selectedMedicines =
    selectedPrescription?.medicines.map((m, i) => ({
      medicineName: m.medicineName,
      dosage: m.dosage,
      duration: m.duration,
      interval: m.interval,
      notes: m.notes,
      appointmentId: selectedPrescription.appointmentId,
      createdAt: selectedPrescription.createdAt,
    })) || [];

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex h-screen    overflow-hidden">
        <PrescriptionSidebar
          prescriptions={prescriptionList}
          selectedId={selectedPrescriptionId}
          onSelect={setSelectedPrescriptionId}
        />

      <div className="flex-1 overflow-y-auto p-6  mt-20 lg:mt-0  bg-gray-50">
        {selectedPrescription && (
          <>
            <PatientDetails
              name={selectedPrescription.patientName}
              image={selectedPrescription.patientImage}
              diagnosis={selectedPrescription.diagnosis}
            />
            <PrescriptionList
              patientId = {selectedPrescription.patientId} 
              id = {selectedPrescription.id}
              prescriptions={selectedMedicines}
              gender = {selectedPrescription.gender}
              age = {selectedPrescription.age}
              phone = {selectedPrescription.phone}
              address = {selectedPrescription.address}
              blood = {selectedPrescription.blood}
              date = {selectedPrescription.date}
              time = {selectedPrescription.time}
              onEdit={handleEdit}
              onDelete={deleteModel}
            />
          </>
        )}
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
            <Button 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => handleDelete(confirmDelete!)}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    {/* </div> */}

        {editing && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Prescription</DialogTitle>
              </DialogHeader>
              <PrescriptionForm onSubmit={handleUpdate} defaultValues={editing} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
