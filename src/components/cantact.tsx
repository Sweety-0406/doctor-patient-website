
"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaRegMessage } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-white text-white text-center">
      {/* Top gradient box */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl items-center flex flex-col justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 p-6 mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/50 my-5 items-center flex justify-center size-16 p-2 rounded-md"
        >
          <FaRegMessage className="size-8" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Stay in the healthcare loop
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-lg"
        >
          Get tips for improving patient care, updates on new features, and exclusive resources delivered to your inbox.
        </motion.p>

        {/* Email Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex w-full md:max-w-md flex-col sm:flex-row mt-8 gap-4 justify-center"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            className="text-white bg-white/50 border-2 transition-transform hover:scale-[1.02]"
          />
          <Button variant="ghost" className="border border-white">
            Get free pack
          </Button>
        </motion.form>

        {/* No spam note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-sm opacity-80 flex my-8"
        >
          <GoDotFill className="mt-[2px] text-cyan-500" /> No spam, ever{" "}
          <GoDotFill className="mt-[2px] ml-8 text-cyan-500" /> Unsubscribe anytime
        </motion.p>
      </motion.div>

      {/* Bottom section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-20 border-t pt-20"
      >
        <div className="flex flex-col md:mx-[5%] md:flex-row gap-5">
          <div className="max-w-4xl flex flex-col justify-center items-center mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl text-black md:text-left md:text-5xl font-bold leading-tight"
            >
              Ready to streamline{" "}
              <span className="bg-teal-500 bg-clip-text text-transparent">
                your patient care?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-4 text-center md:text-left text-lg md:text-xl text-gray-500 md:mr-[15%]"
            >
              Join thousands of healthcare providers who trust our platform to
              manage appointments, records, and prescriptions. Start your free
              account today and see the difference.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 flex justify-center md:justify-start gap-4"
            >
              <Button
                variant="teal"
                className="bg-teal-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:opacity-70"
              >
                Start Managing Patients – it&apos;s free
              </Button>
              <Button variant="outline" className="text-black">
                Speak with an Expert
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-0 flex justify-center"
          >
            <Image
              src="/images/doc-pat.jpg"
              alt="PixelForge UI"
              width={1000}
              height={600}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
