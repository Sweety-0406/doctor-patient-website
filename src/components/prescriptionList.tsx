

"use client";

import { MdEditNote, MdDeleteSweep } from "react-icons/md";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getPatientAppointments } from "@/lib/api";
import { Appointment } from "@/app/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiChartLine } from "react-icons/ti";
import { 
  User, 
  Phone, 
  MapPin, 
  Droplets, 
  Calendar, 
  Clock, 
  Pill,
  FileText,
  Activity,
  Hash,
  UserCheck
} from "lucide-react";

interface Prescription {
  medicineName: string;
  dosage: string;
  duration: string;
  interval: string;
  notes?: string;
  appointmentId: string;
  createdAt: string;
}

interface Props {
  prescriptions: Prescription[];
  id: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  blood: string;
  date: string;
  time: string;
  patientId: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function PrescriptionList({
  prescriptions,
  onEdit,
  onDelete,
  id,
  gender,
  age,
  phone,
  address,
  blood,
  date,
  time,
  patientId,
}: Props) {
  const [latestDiagnoses, setLatestDiagnoses] = useState<Appointment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestDiagnoses();
  }, [patientId]);

  const fetchLatestDiagnoses = async () => {
    try {
      setIsLoading(true);
      const res = await getPatientAppointments(patientId);
      const data = await res.json();
      setLatestDiagnoses(data);
    } catch (error) {
      console.error("Failed to fetch diagnoses", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender.toLowerCase() === 'male' ? '👨' : gender.toLowerCase() === 'female' ? '👩' : '👤';
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'bg-red-100 text-red-700',
      'A-': 'bg-red-200 text-red-800',
      'B+': 'bg-blue-100 text-blue-700',
      'B-': 'bg-blue-200 text-blue-800',
      'O+': 'bg-green-100 text-green-700',
      'O-': 'bg-green-200 text-green-800',
      'AB+': 'bg-purple-100 text-purple-700',
      'AB-': 'bg-purple-200 text-purple-800',
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm rounded-xl border-0  mb-8">
          <TabsTrigger 
            value="patient" 
            className="rounded-lg cursor-pointer  font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
          >
            <User className="w-4 h-4 mr-2" />
            Patient Info
          </TabsTrigger>
          <TabsTrigger 
            value="prescriptions" 
            className="rounded-lg cursor-pointer  font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
          >
            <Pill className="w-4 h-4 mr-2" />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="mt-0 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Latest Diagnoses Section */}
              {latestDiagnoses && latestDiagnoses.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl mr-4">
                      <Activity className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Latest Diagnoses</h2>
                      <p className="text-gray-500">Recent medical consultations</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latestDiagnoses.slice(0, 3).map((appt, index) => (
                      <div
                        key={appt.id}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
                        <div className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-teal-500 rounded-lg">
                              <TiChartLine className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {appt.diagnosis}
                          </h3>
                          <div className="flex items-center text-sm text-teal-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(appt.date), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patient Information Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-4">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>
                    <p className="text-gray-500">Personal details and contact information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<User className="w-5 h-5" />}
                    title="Age"
                    value={`${age} years old`}
                    color="blue"
                  />
                  <InfoCard
                    icon={<span className="text-lg">{getGenderIcon(gender)}</span>}
                    title="Gender"
                    value={gender}
                    color="purple"
                  />
                  <InfoCard
                    icon={<Droplets className="w-5 h-5" />}
                    title="Blood Type"
                    value={blood}
                    color="red"
                    customBadge={
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBloodTypeColor(blood)}`}>
                        {blood}
                      </span>
                    }
                  />
                  <InfoCard
                    icon={<Phone className="w-5 h-5" />}
                    title="Phone"
                    value={phone}
                    color="green"
                  />
                  <InfoCard
                    icon={<MapPin className="w-5 h-5" />}
                    title="Address"
                    value={address}
                    color="orange"
                    fullWidth
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-0">
          <div className="bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-100 rounded-xl mr-4">
                  <Pill className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
                  <p className="text-gray-500">{prescriptions.length} medication{prescriptions.length !== 1 ? 's' : ''} prescribed</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => onEdit()} 
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  <MdEditNote size={20} /> 
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(id)} 
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  <MdDeleteSweep size={20} /> 
                  Delete
                </button>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <Pill className="w-8 h-8 text-gray-400 mx-auto mt-2" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Prescriptions</h3>
                <p className="text-gray-400">No medications have been prescribed yet.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {prescriptions.map((item, index: number) => (
                  <div key={index} className="group bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl px-6 py-4 border border-teal-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-teal-500 rounded-lg mr-3">
                            <Pill className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 capitalize">{item.medicineName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {item.dosage}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg px-4 py-2 border border-gray-100">
                            <div className="flex items-center mb-2">
                              <Calendar className="w-4 h-4 text-orange-500 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Interval</span>
                            </div>
                            <p className="text-gray-900 font-semibold capitalize">{item.interval}</p>
                          </div>

                          <div className="bg-white rounded-lg px-4 py-2 border border-gray-100">
                            <div className="flex items-center mb-2">
                              <Hash className="w-4 h-4 text-purple-500 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Appointment</span>
                            </div>
                            <p className="text-gray-600 font-mono text-sm">{item.appointmentId}</p>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-semibold text-amber-800 mb-1">Notes:</h4>
                                <p className="text-sm text-amber-700">{item.notes}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className="text-xs text-gray-500">
                            Prescribed on {format(new Date(item.createdAt), "dd MMM yyyy")}
                          </span>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const InfoCard = ({
  icon,
  title,
  value,
  color,
  customBadge,
  fullWidth = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  customBadge?: React.ReactNode;
  fullWidth?: boolean;
}) => {
  const colorClasses: { [key: string]: string } = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    red: 'text-red-600 bg-red-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  return (
    <div className={`bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color]} mr-3`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-lg font-semibold text-gray-900">{customBadge ? '' : value}</p>
          </div>
        </div>
        {customBadge && customBadge}
      </div>
    </div>
  );
};