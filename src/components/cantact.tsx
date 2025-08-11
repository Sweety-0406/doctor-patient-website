"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaRegMessage } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import Image from "next/image";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-white text-white text-center">
      <div className="max-w-4xl items-center flex flex-col justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 p-6 mx-auto">
        <div className="bg-white/50 my-5 items-center flex justify-center size-16 p-2 rounded-md">
          <FaRegMessage className="size-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay in the creative loop</h2>
        <p className="max-w-lg ">Get design tips, new templates, and exclusive features delivered to your inbox. Plus, get a free premium template pack when you subscribe!</p>
        <form className="flex w-full md:max-w-md flex-col sm:flex-row mt-8 gap-4 justify-center">
          <Input
            type="email" 
            placeholder="you@example.com"
            className="text-white bg-white/50 border-2"
          />
          <Button variant="ghost" className="border border-white bg-" >Get free pack</Button>
        </form>
        <p className=" text-sm opacity-80 flex my-8"><GoDotFill className="mt-[2px] text-cyan-500" />No spam, ever <GoDotFill className="mt-[2px] ml-8 text-cyan-500" /> Unsubscribe anytime</p>
      </div>
      <div className="mt-20 border-t pt-20">
        <div className="flex flex-col md:mx-[5%] md:flex-row gap-5">
          <div className="max-w-4xl flex flex-col justify-center items-center mx-auto">
            <h1 className="text-4xl text-black md:text-left md:text-5xl font-bold leading-tight">
            Ready to start creating <span className="bg-teal-500  bg-clip-text text-transparent"> amazing designs?</span>
            </h1>
            <p className="mt-4 text-center md:text-left text-lg md:text-xl text-gray-500 md:mr-[15%]">
            Join millions of creators who trust PixelForge to bring their ideas to life. Start your free account today and discover what you can create.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
            <Button variant="teal" className=" bg-teal-500  text-white font-bold px-6 py-3 rounded-lg shadow-md hover:opacity-70">
              Start Creating Free - it&apos;s free
            </Button>
            <Button variant="outline" className="text-black">
              Talk to sale
            </Button>
            </div>
          </div>
          <div className="mt-16 md:mt-0 flex justify-center">
            <Image
            src="/images/doc-pat.jpg"
            alt="PixelForge UI"
            width={1000}
            height={600}
            className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
