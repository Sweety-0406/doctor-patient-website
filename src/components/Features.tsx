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
        icon:IoIosColorPalette,
        title:"Intuitive Design Tools",
        description: "Professional-grade editing tools that are easy to use for everyone, from beginners to design experts."
    },
    {
        icon:BsLightningChargeFill,
        title:"Lightning Fast",
        description: "Cloud-powered performance ensures your designs load instantly and save automatically."
    },
    {
        icon:FaUserGroup,
        title:"Team Collaboration",
        description: "Work together in real-time with commenting, sharing, and version control features."
    },
    {
        icon:MdOutlinePhoneAndroid,
        title:"Multi-Platform",
        description: "Design on any device - desktop, tablet, or mobile. Your work syncs seamlessly across all platforms."
    },
    {
        icon:FaCloud,
        title:"Cloud Storage",
        description: "Never lose your work with unlimited cloud storage and automatic backups."
    },
    {
        icon:MdOutlineSecurity ,
        title:"Enterprise Security",
        description: "Bank-level security with SSO, team management, and advanced permission controls."
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
                  create amazing designs
                </span>
              </span>
            </h2>

            <p className="text-lg  text-center mb-16 text-gray-500">From powerful editing tools to seamless collaboration, PixelForge has everything you need to bring your creative vision to life.</p>
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
