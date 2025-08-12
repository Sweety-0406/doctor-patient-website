import TestimonialCard from "./testimonialCard";

const testimonials = [
  {
    name: "Dr. Sarah Williams",
    iconText: "👩‍⚕️",
    profession: "Cardiologist",
    description: "This platform has completely streamlined my patient management. I can access records instantly and spend more time focusing on care instead of paperwork."
  },
  {
    name: "Dr. David Kim",
    iconText: "👨‍⚕️",
    profession: "General Practitioner",
    description: "I've used multiple systems before, but this is by far the most intuitive. Managing appointments and prescriptions has never been easier."
  },
  {
    name: "Nurse Lina Gomez",
    iconText: "👩‍⚕️",
    profession: "Head Nurse",
    description: "Our clinic went from piles of paperwork to a fully digital workflow. Communication between doctors and nurses has improved drastically."
  },
  {
    name: "Raj Patel",
    iconText: "🏥",
    profession: "Clinic Administrator",
    description: "The collaboration tools are incredible. Doctors, nurses, and staff can share updates in real-time, and our patients love the improved efficiency."
  }
];


export default function Testimonials() {
  return (
    <section className="pt-20  bg-white">
      <div className=" mx-auto text-center">
      <div className="text-center flex flex-col justify-center items-center w-full">
          <h2 className="text-4xl md:text-5xl  font-bold mb-5 text-center leading-tight">
            <span className="whitespace-pre-wrap">
              Loved by {" "}
              <span className="bg-teal-500   bg-clip-text text-transparent">
                healthcare professionals
              </span>
            </span>
          </h2>
          <p className="text-lg mb-16 max-w-xl text-gray-500">Join thousands of doctors, nurses, and clinics who rely on our platform to deliver exceptional patient care every day.</p>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} name={t.name} description={t.description} iconText={t.iconText} profession={t.profession} />
          ))}
        </div>
      </div>
    </section>
  );
}
