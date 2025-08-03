"use client";
import { Patient } from "@/app/types";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";


type PatientAuthContextType = {
  patient: Patient | null;
  login: (patient: Patient) => void;
  logout: () => void;
  loading: boolean;
};

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export const PatientAuthProvider = ({ children }: { children: ReactNode }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (storedPatient) {
      try {
        const parsed = JSON.parse(storedPatient);
        setPatient(parsed);
        console.log("Patient loaded from localStorage:", parsed);
      } catch (error) {
        console.error("Failed to parse patient from localStorage:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = (patient: Patient) => {
    setPatient(patient);
    try {
      localStorage.setItem("patient", JSON.stringify(patient));
      console.log("Patient saved to localStorage:", patient);
    } catch (error) {
      console.error("Failed to save patient to localStorage:", error);
    }
  };

  const logout = () => {
    setPatient(null);
    localStorage.removeItem("patient");
  };

  return (
    <PatientAuthContext.Provider value={{ patient, login, logout, loading }}>
      {!loading && children}
    </PatientAuthContext.Provider>
  );
};

export const usePatientAuth = () => {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error("usePatientAuth must be used inside a PatientAuthProvider");
  }
  return context;
};
