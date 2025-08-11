"use client"

import { FaUserGroup, FaArrowTrendUp  } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { TbWorld } from "react-icons/tb";
import StatsCard from "./statsCard";
import Testimonials from "./testimonials";


export default function Stats() {
  const stats = [
    {
      icon:FaUserGroup,
      title:"10M+",
      description:"Active Creators",
      color:"text-violet-500"
    },
    {
      icon:FiDownload,
      title:"50M+",
      description:"Designs Created",
      color:"text-cyan-500"
    },
    {
      icon:TbWorld,
      title:"150M+",
      description:"Countries",
      color:"text-orange-500"
    },
    {
      icon:FaArrowTrendUp ,
      title:"99.9%",
      description:"Uptime",
      color:"text-violet-500"
    }
  ];

  return (
    <section id="about" className="py-16  px-6  md:mx-[5%]  text-center">
      <div className="text-center flex flex-col justify-center items-center w-full">
          <h2 className="text-4xl md:text-5xl  font-bold mb-5 text-center leading-tight">
            <span className="whitespace-pre-wrap">
              Trusted by {" "}
              <span className="bg-teal-500 bg-clip-text text-transparent">
                millions worldwide
              </span>
            </span>
          </h2>
          <p className="text-lg mb-16 max-w-md text-gray-500">Numbers that speak to our commitment to providing the best design experience. </p>
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
