'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import {  Doctor } from '@/app/types';
import { usePatientAuth } from '@/context/patientAuthContext';
import Footer from '@/components/footer';
import DoctorCard from '@/components/doctorCard';
import { IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';
import { CiLocationOn } from 'react-icons/ci';
import { getDoctors } from '@/lib/api';
import WebsiteFooter from '@/components/websiteFooter';
import LoaderSection from '@/components/loader';
import ErrorSection from '@/components/error';


export default function PatientDashboard() {
    const { patient, loading } = usePatientAuth();
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      if (!loading && patient) {
        console.log(patient)
          fetchDoctors()
      } else if (!loading && !patient) {
          router.push("/patient/login");
      }
    }, [loading, patient]);


    const fetchDoctors = async ()=>{
      const res = await getDoctors()
      setDoctors(res)
    }

    const filteredDoctors = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading )
    return <LoaderSection />;

  if ( !patient)
    return <ErrorSection />;

  return (
    <div className="max-h-screen  overflow-y-scroll  flex bg-white">
      {/* Main Content */}
      <main className="  w-full h-screen overflow-y-hidden mx-auto ">
        <div className="max-h-[20vh] text-white">
          <div className="flex bg-teal-500 py-2 px-6 lg:px-10 justify-between">
            <div className="flex gap-3">
              <div>
                <img  src="/images/user.jpg" alt="" className="size-10 rounded-full" />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold flex">
                  Hello , {patient  && patient.name && (
                    <div>
                      {patient.name.toUpperCase()}
                    </div>
                  )}
                </div>
                <div >
                  <p className="flex text-sm text-white"><span className="mt-[3px]"><CiLocationOn className='font-bold text-xl -mt-1' /></span>{patient.location}</p>
                </div>
              </div>
              
            </div>
            <div onClick={()=>{router.push("/patient/notificationPage")}} className="relative cursor-pointer">
              <IoNotificationsOutline className="size-7 mt-2 " />
              <div className="size-4 rounded-full bg-red-400 text-xs text-center text-white absolute top-1 right-0">4</div>
            </div>
          </div>
          <div className="relative mb-4 mt-8 px-6 lg:px-12 ">
            <input
              type="text"
              placeholder="Search Doctors"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-gray-500 px-4 pl-20 py-3 bg-gray-100  rounded-lg shadow-sm text-sm focus:border focus:outline-none focus:border-teal-400"
            />
            <span className="absolute left-16 top-3 text-gray-400">
              <IoSearchOutline className="size-5" />
            </span>
          </div>
        </div>

        <div className="max-h-[70vh] w-full overflow-y-auto px-2">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredDoctors.map((d, index) => (
                <DoctorCard key={index} {...d} />
              ))}
            </div>
          </div>
          <WebsiteFooter />
        </div>
        <div className="h-[10vh] px-6 lg:px-10 items-center ">
          <Footer page="home" />
        </div>
      </main>
    </div>
  );
}


