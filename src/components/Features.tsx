
'use client';
import { motion } from "framer-motion";
import { IoIosColorPalette } from "react-icons/io";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlinePhoneAndroid, MdOutlineSecurity } from "react-icons/md";
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
      <div className="mx-auto">
        <div className="text-center flex justify-center w-full">
          <div className="max-w-4xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
            >
              Everything you need to{" "}
              <span className="bg-teal-500 bg-clip-text text-transparent">
                provide exceptional care
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg mb-16 text-gray-500"
            >
              From managing appointments to tracking prescriptions, our platform helps you deliver the best for every patient.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
