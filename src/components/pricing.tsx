
"use client";
import { motion } from "framer-motion";
import PricingCard from "./pricingCard";

const plans = [
  {
    title: "Free",
    cost: "0",
    costText: "forever",
    description: "Perfect for getting started with patient management",
    features: [
      "Up to 50 patient records",
      "Basic appointment scheduling",
      "Standard reporting",
      "Email support",
      "1GB secure storage",
    ],
  },
  {
    title: "Pro",
    cost: "49",
    costText: "per month",
    description: "For growing clinics and healthcare teams",
    features: [
      "Unlimited patient records",
      "Advanced appointment scheduling",
      "E-prescriptions",
      "Priority support",
      "Multi-user access & roles",
      "Custom reports & analytics",
      "100GB secure storage",
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    cost: "Custom",
    costText: "pricing",
    description: "For hospitals and large healthcare networks",
    features: [
      "Everything in Pro",
      "Unlimited secure storage",
      "Custom branding & white-label options",
      "SSO & advanced security",
      "Dedicated account manager",
      "Custom integrations with EMR/EHR",
      "Advanced admin controls",
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-6 md:px-[5%] lg:px-[10%] bg-gradient-to-b from-white to-muted"
    >
      <div className="mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center flex flex-col justify-center items-center w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-center leading-tight">
            <span className="whitespace-pre-wrap">
              Flexible plans for{" "}
              <span className="bg-teal-500 bg-clip-text text-transparent">
                every healthcare provider
              </span>
            </span>
          </h2>
          <p className="text-lg mb-16 max-w-xl text-gray-500">
            Start free and upgrade as your practice grows. All plans include
            our core patient management tools and dedicated support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 lg:gap-10">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
              }}
              viewport={{ once: true }}
            >
              <PricingCard
                title={plan.title}
                cost={plan.cost}
                costText={plan.costText}
                features={plan.features}
                description={plan.description}
                popular={plan.popular}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
