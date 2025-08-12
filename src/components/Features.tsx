'use client';
import Image from "next/image";
import { IoIosColorPalette } from "react-icons/io";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlinePhoneAndroid, MdOutlineSecurity  } from "react-icons/md";
import { FaCloud } from "react-icons/fa";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: IoIosColorPalette,
    title: "User-Friendly Interface",
    description: "An intuitive dashboard designed for doctors and staff, making patient management effortless."
  },
  {
    icon: BsLightningChargeFill,
    title: "Lightning Fast Access",
    description: "Instantly retrieve patient records, appointments, and prescriptions without delays."
  },
  {
    icon: FaUserGroup,
    title: "Team Collaboration",
    description: "Coordinate seamlessly with nurses, specialists, and administrative staff in real-time."
  },
  {
    icon: MdOutlinePhoneAndroid,
    title: "Multi-Device Access",
    description: "Access patient data securely from desktop, tablet, or mobile — anywhere, anytime."
  },
  {
    icon: FaCloud,
    title: "Secure Cloud Storage",
    description: "All patient records are stored in the cloud with automatic backups and HIPAA compliance."
  },
  {
    icon: MdOutlineSecurity,
    title: "Enterprise-Grade Security",
    description: "Advanced encryption, role-based permissions, and secure logins to protect patient data."
  }
];


export default function Features() {
  return (
    <section id="features" className="py-20 px-6 md:mx-[5%] bg-white text-gray-800">
      <div className=" mx-auto ">
        <div className="text-center flex justify-center w-full">
          <div className="max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl  font-bold mb-5 text-center leading-tight">
              <span className="whitespace-pre-wrap">
                Everything you need to{" "}
                <span className="bg-teal-500  bg-clip-text text-transparent">
                  provide exceptional care
                </span>
              </span>
            </h2>

            <p className="text-lg  text-center mb-16 text-gray-500">From managing appointments to tracking prescriptions, our platform helps you deliver the best for every patient.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} title={feature.title} description={feature.description} icon={feature.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
