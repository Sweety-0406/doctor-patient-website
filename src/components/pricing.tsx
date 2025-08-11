import PricingCard from "./pricingCard";

const plans = [
  {
    title: "Free",
    cost: "0",
    costText: "forever",
    description:"Perfect for getting started with design",
    features: ["5 projects", "Basic templates", "Standard export quality", "Community support", "1GB storage"]
  },
  {
    title: "Pro",
    cost: "12",
    costText: "per month",
    description:"For professional designers and teams",
    features: ["Unlimited projects", "Premium templates", "4K export quality", "Priority support", "Team collaboration", "Advanced tools", "100GB storage"],
    popular: true
  },
  {
    title: "Enterprise",
    cost: "Custom",
    costText: "pricing",
    description:"For large teams and organizations",
    features: ["Everything in Pro", "Unlimited storage", "Custom branding", "SSO integration", "Dedicated support", "Custom integrations", "Admin controls"]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 md:px-[5%] lg:px-[10%] ] bg-gradient-to-b from-white to-muted">
      <div className=" mx-auto text-center">
        <div className="text-center flex flex-col justify-center items-center w-full">
          <h2 className="text-4xl md:text-5xl  font-bold mb-5 text-center leading-tight">
            <span className="whitespace-pre-wrap">
              Choose your {" "}
              <span className="bg-teal-500  bg-clip-text text-transparent">
                creative plan
              </span>
            </span>
          </h2>          
          <p className="text-lg mb-16 max-w-xl text-gray-500">Start free and upgrade as you grow. All plans include our core design tools and customer support.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 lg:gap-10">
          {plans.map((plan, i) => (
            <PricingCard key={i} title={plan.title} cost={plan.cost} costText={plan.costText} features={plan.features} description={plan.description} popular={plan.popular} />
          ))}
        </div>
      </div>
    </section>
  );
}
