"use client";

import { useState } from "react";
import { FiSearch, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
}

export default function PatientNotifications() {
  const [notifications] = useState<{
    today: Notification[];
    yesterday: Notification[];
    older: Notification[];
  }>({
    today: [
      {
        id: 1,
        title: "Prescription Added",
        description: "Your doctor added a new prescription to your profile.",
        time: "1h ago",
      },
      {
        id: 2,
        title: "Appointment Reminder",
        description: "You have an appointment scheduled for 5 PM today.",
        time: "3h ago",
      },
    ],
    yesterday: [
      {
        id: 3,
        title: "Lab Results Available",
        description: "Your blood test results are now available in the portal.",
        time: "Yesterday",
      },
      {
        id: 4,
        title: "Appointment Completed",
        description: "Your consultation with Dr. Smith was completed successfully.",
        time: "Yesterday",
      },
    ],
    older: [
      {
        id: 5,
        title: "New Health Tip",
        description: "Stay hydrated and maintain your medication schedule.",
        time: "2 days ago",
      },
    ],
  });

  const [search, setSearch] = useState("");
  const router = useRouter()

  const filterNotifications = (list: Notification[]) => {
    return list.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Top Bar */}
      <div className="flex lg:px-[5%] text-white bg-teal-500 p-6 flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl flex gap-3 md:text-3xl font-bold"><span><FaArrowLeft onClick={() => router.back()} className="cursor-pointer text-2xl md:text-4xl mt-1 md:mt-0 font-semibold  text-white" /></span>Notifications</h1>
        <div className="flex items-center gap-4">
          <button className="bg-white text-teal-500  px-4 py-2 rounded hover:bg-muted cursor-pointer">
            Mark all as Read
          </button>
          <FiBell className="text-2xl md:text-3xl" />
          <div>
            <img  src="/images/user.jpg" alt="" className="size-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 mt-8 px-6 lg:px-12 lg:px-[5%] ">
        <span className="absolute left-16 lg:left-28 top-3 text-gray-400">
          <IoSearchOutline className="size-5" />
        </span>
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-gray-500 px-4 pl-20 py-3 bg-gray-100  rounded-lg shadow-sm text-sm focus:border focus:outline-none focus:border-teal-400"
        />
      </div>

      {/* Notifications */}
      <div className="space-y-8 p-6 lg:px-[5%]">
        {/* Today */}
        {filterNotifications(notifications.today).length > 0 && (
          <div>
            <h2 className="text-gray-600 font-semibold mb-3">Today</h2>
            <div className="space-y-3">
              {filterNotifications(notifications.today).map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))}
            </div>
          </div>
        )}

        {/* Yesterday */}
        {filterNotifications(notifications.yesterday).length > 0 && (
          <div>
            <h2 className="text-gray-600 font-semibold mb-3">Yesterday</h2>
            <div className="space-y-3">
              {filterNotifications(notifications.yesterday).map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))}
            </div>
          </div>
        )}

        {/* Older */}
        {filterNotifications(notifications.older).length > 0 && (
          <div>
            <h2 className="text-gray-600 font-semibold mb-3">Earlier</h2>
            <div className="space-y-3">
              {filterNotifications(notifications.older).map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))}
            </div>
          </div>
        )} 
      </div>
    </div>
  );
}

const NotificationCard = ({ notification }: { notification: Notification }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-start hover:shadow-md transition">
      <div>
        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
        <span className="text-xs text-gray-400">{notification.time}</span>
      </div>
      <button className="text-teal-500 text-sm font-medium hover:underline">
        View
      </button>
    </div>
  );
};
