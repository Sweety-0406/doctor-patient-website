"use client"
type Props = {
  activeTab: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  setActiveTab: (tab: "pending" | "approved" | "rejected" | "completed" |"cancelled") => void;
};

export default function AppointmentTabs({ activeTab, setActiveTab }: Props) {
  const tabs = ["Pending", "Approved", "Rejected", "completed", "cancelled"];

  return (
    <div className="flex justify-around border-b">
      {tabs.map((tab) => {
        const key = tab.toLowerCase() as Props["activeTab"];
        const isActive = activeTab === key;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(key)}
            className={`py-2 px-4 cursor-pointer text-sm font-medium ${
              isActive ? "border-b-2 border-teal-500 text-teal-600" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
