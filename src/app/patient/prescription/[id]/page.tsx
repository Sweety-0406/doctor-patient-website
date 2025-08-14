
"use client";

import { useEffect,useRef, useState, CSSProperties } from "react";
import { useParams } from "next/navigation";
import { getDoctorById, getPrescriptionsByPatient } from "@/lib/api";
import { Doctor, Prescription } from "@/app/types";
import { PiDotOutlineFill, PiPhoneCallFill } from "react-icons/pi";
import { MdMarkEmailRead } from "react-icons/md";
import { useRouter } from "next/navigation";
import {  FiPrinter } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Watermark style
const watermarkStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: "4rem",
  color: "rgba(0, 0, 0, 0.05)",
  zIndex: 0,
  userSelect: "none",
  pointerEvents: "none",
};

export default function PatientPrescriptionPage() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [doc, setDoc] = useState<Doctor | null>(null);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
        fetchPrescriptions()
    };
  }, [id]);

    const fetchPrescriptions = async () => {
        const res = await getPrescriptionsByPatient(id as string);
        const selected = Array.isArray(res) ? res[0] : res;
        setPrescription(selected);

        if (selected?.doctorId) {
            const doctorRes = await getDoctorById(selected.doctorId);
            setDoc(doctorRes);
        }
    };


  if (!prescription) return <div className="p-6">Loading...</div>;

    const handlePrint = () => {
        if (!printRef.current) return;

        const printContent = printRef.current.innerHTML;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

            printWindow.document.write(`
            <html>
                <head>
                <title>Print Prescription</title>
                <style>
                    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

                    body {
                    font-family: sans-serif;
                    padding: 20px;
                    print-color-adjust: exact !important;
                    }

                    .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 4rem;
                    color: rgba(0, 0, 0, 0.05);
                    z-index: 0;
                    user-select: none;
                    pointer-events: none;
                    }

                    img {
                    max-width: 100px;
                    height: auto;
                    }

                    table {
                    width: 100%;
                    border-collapse: collapse;
                    }

                    th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                    }

                    .text-teal-500 {
                    color: #14b8a6;
                    }

                    .bg-teal-500 {
                    background-color: #14b8a6;
                    color: white;
                    }

                    .flex {
                    display: flex;
                    }

                    .justify-between {
                    justify-content: space-between;
                    }

                    .items-center {
                    align-items: center;
                    }

                    .gap-2 {
                    gap: 0.5rem;
                    }

                    .text-xs {
                    font-size: 0.75rem;
                    }

                    .text-sm {
                    font-size: 0.875rem;
                    }
                </style>
                </head>
                <body>${printContent}</body>
            </html>
            `);


        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };



  return (
    <div className=" items-center relative  border bg-white min-h-screen max-w-2xl  mx-auto ">
        <div ref={printRef}>
            {/* Watermark */}
            <div style={watermarkStyle}>Doc-Center</div>

            <div className="z-10 relative ">
                {/* Header */}
                <div
                className="flex justify-between px-6 pt-2 mb-0"
                style={{ alignItems: "center" }}
                >
                <div>
                    <img
                    src="/images/doctor-logo.png"
                    alt="doctor logo"
                    style={{ width: "100px", height: "auto" }}
                    />
                </div>

                <div
                    style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    }}
                >
                    Doc-Center
                </div>

                <div className="flex flex-col -mt-4 items-center">
                    <img
                    src="/images/logo.png"
                    alt="logo"
                    style={{ width: "40px", height: "auto", marginTop: "0.5rem" }}
                    />
                    <p
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        borderTop: "2px solid #14b8a6",
                        borderBottom: "2px solid #14b8a6",
                        color: "#14b8a6",
                        padding: "0.25rem",
                        display: "flex",
                        gap: "2px",
                    }}
                    >
                    A
                    <PiDotOutlineFill style={{ color: "#6b7280", fontSize: "1rem" }} />
                    W
                    <PiDotOutlineFill style={{ color: "#6b7280", fontSize: "1rem" }} />
                    E
                    <PiDotOutlineFill style={{ color: "#6b7280", fontSize: "1rem" }} />
                    S
                    <PiDotOutlineFill style={{ color: "#6b7280", fontSize: "1rem" }} />
                    O
                    <PiDotOutlineFill style={{ color: "#6b7280", fontSize: "1rem" }} />
                    M
                    <PiDotOutlineFill style={{ color: "#6b7280", fontSize: "1rem" }} />
                    E
                    </p>
                </div>
                </div>
                <div className="h-10 flex font-semibold items-center justify-center text-white bg-teal-500 -mt-6">
                    Thank you for visiting!
                </div>
                <div className="px-6 pt-4">
                    {/* Content */}
                    <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-teal-500 capitalize">
                        {prescription.patientName}
                        </h1>
                        <p className="text-sm text-gray-600">{prescription.address}</p>
                        <p className="text-sm text-gray-600">Phone: {prescription.phone}</p>
                    </div>
                    {doc && (
                        <div className="text-xs text-gray-600 mt-1">
                        <p className="font-semibold text-base text-teal-500">{doc.name}</p>
                        <p>{doc.qualification}</p>
                        <p>{doc.specialization}</p>
                        </div>
                    )}
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2   gap-3 mt-6 text-sm">
                    <div><strong>Gender:</strong> {prescription.gender}</div>
                    <div><strong>Age:</strong> {prescription.age}</div>
                    <div><strong>Blood Group:</strong> {prescription.blood}</div>
                    <div><strong>Diagnosis:</strong> {prescription.diagnosis}</div>
                    <div><strong>Appointment Date:</strong> {prescription.date}</div>
                    <div><strong>Time:</strong> {prescription.time}</div>
                    </div>

                    {/* Medicine Table */}
                    <div className="mt-8 z-10 relative">
                    <h2 className="text-xl font-semibold text-teal-500 mb-4">Prescribed Medicines</h2>

                    <Table className="border rounded">
                        <TableHeader>
                        <TableRow className="font-bold bg-teal-500 hover:bg-teal-500 ">
                            <TableHead className="text-white">Medicine Name</TableHead>
                            <TableHead className="text-white">Dosage</TableHead>
                            <TableHead className="text-white">Duration</TableHead>
                            <TableHead className="text-white">Notes</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {prescription.medicines && prescription.medicines.map((med, index) => (
                            <TableRow key={index}>
                            <TableCell>{med.medicineName}</TableCell>
                            <TableCell>{med.dosage}</TableCell>
                            <TableCell>{med.duration}</TableCell>
                            <TableCell>{med.notes || "—"}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>
                    {/* Doctor Info & Signature */}
                    <div className="mt-12 border-t pt-4 mb-2 text-sm text-gray-700">
                        {doc && (
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="md:pt-8">
                                    <p><strong>Consultation Fee:</strong> ₹{doc.fees}</p>
                                </div>
                                <div>
                                    <div className="w-48 h-5 md:h-10 border-b border-gray-400 " />
                                    <p className="text-xs italic mt-1 text-gray-500">Doctor&apos;s Signature</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                    <div className=" flex px-6 py-2 font-semibold items-center justify-between text-white bg-teal-500 ">
                        <div className="flex gap-2"> <MdMarkEmailRead className="bg-white mt-1 size-6 text-teal-500 p-1 rounded-full" />{doc?.email || "doc@gmail.com"} </div>
                        <div className="flex gap-2"> <PiPhoneCallFill className="bg-white mt-1 size-6 text-teal-500 p-1 rounded-full" />{doc?.phone || "+91 9807234780"} </div>
                    </div>
            </div>
        </div>
        <div className="flex justify-between items-center px-6 py-3">
            <button
                onClick={() => router.back()}
                className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-3 py-1 rounded flex items-center gap-2 text-sm"
            >
                Back
            </button>

            <div className="flex print:hidden gap-3">
                <button
                onClick={handlePrint}
                className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-3 py-1 rounded flex items-center gap-2 text-sm"
                >
                <FiPrinter /> Print
                </button>
            </div>
            </div>

    </div>
  );
}
