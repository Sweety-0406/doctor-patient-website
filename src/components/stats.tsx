"use client"

import { FaUserGroup, FaArrowTrendUp  } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { TbWorld } from "react-icons/tb";
import StatsCard from "./statsCard";
import Testimonials from "./testimonials";

const stats = [
  {
    icon: FaUserGroup,
    title: "1M+",
    description: "Patients Managed",
    color: "text-violet-500"
  },
  {
    icon: FiDownload,
    title: "5M+",
    description: "Appointments Scheduled",
    color: "text-cyan-500"
  },
  {
    icon: TbWorld,
    title: "50+",
    description: "Countries Served",
    color: "text-orange-500"
  },
  {
    icon: FaArrowTrendUp,
    title: "99.9%",
    description: "System Uptime",
    color: "text-violet-500"
  }
];

export default function Stats() {

  return (
    <section id="about" className="py-16  px-6  md:mx-[5%]  text-center">
      <div className="text-center flex flex-col justify-center items-center w-full">
          <h2 className="text-4xl md:text-5xl  font-bold mb-5 text-center leading-tight">
            <span className="whitespace-pre-wrap">
              Trusted by {" "}
              <span className="bg-teal-500 bg-clip-text text-transparent">
                healthcare professionals worldwide
              </span>
            </span>
          </h2>
          <p className="text-lg mb-16 max-w-md text-gray-500">Our results speak to our commitment to efficient, secure healthcare management.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8  mx-auto">
        {stats.map((stat, i) => (
          <StatsCard key={i} icon={stat.icon} title={stat.title} description={stat.description} color={stat.color} />
        ))}
      </div>
      <Testimonials />
    </section>
  );
}
