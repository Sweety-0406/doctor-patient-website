"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

export default function InviteFriendsPage() {
  const router = useRouter();
  const [inviteLink] = useState("every.org/@carl?c=give10");
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState("");
  const [invitedUsers] = useState([
    { name: "Omar Diab", status: "Waiting", avatar: "/images/boy.jpg" },
    { name: "Tina Roh", status: "Signed up and donating!", avatar: "/images/girl2.jpg" },
    { name: "Mark Ulrich", status: "Signed up and donating!", avatar: "/images/boy2.jpg" },
    { name: "Franceska Rolda", status: "Signed up and donating!", avatar: "/images/girl3.jpg" },
    { name: "Carl Spencer", status: "Signed up and donating!", avatar: "/images/boy3.jpg" },
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvites = () => {
    if (emails.includes("@gmail.com")) {
      toast.success(`Invites sent to: ${emails}`);
    } else {
      toast.error("Invalid email address.");
    }
    setEmails("");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-teal-500 absolute w-full h-[32vh] text-white text-center py-8 px-4">
        <h1 className="text-3xl font-bold">Invite friends, give $25</h1>
        <p className="mt-2 text-sm">
          Each friend that joins and donates with your link will get $25 for their second donation to help any nonprofit.
        </p>
      </div>
      <FaArrowLeft onClick={() => router.back()} className="cursor-pointer relative top-4 left-4 text-4xl font-semibold  text-white" />

      <div className="max-w-6xl relative pt-36 z-10 mx-auto flex flex-col lg:flex-row gap-8 p-6">
        {/* Left Section */}
        <div className="bg-white rounded-lg shadow p-6 flex-1">
          <h2 className="font-semibold text-lg mb-4">Send email invites</h2>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Email addresses..."
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <button
              onClick={handleSendInvites}
              className="bg-teal-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Send invites
            </button>
          </div>
          <h3 className="font-medium mb-2">Invited</h3>
          <div className="space-y-3">
            {invitedUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </div>
                <span className="text-sm text-gray-500">{user.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white rounded-lg shadow p-6 w-full lg:w-80">
          <h2 className="font-semibold mb-4">Your invite link</h2>
          <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 mb-2">
            <span className="text-gray-600 text-sm truncate">{inviteLink}</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-teal-500  flex items-center text-center justify-center gap-2 font-semibold w-full bg-teal-500 px-2 py-1 text-white rounded-full cursor-pointer hover:bg-teal-600"
          >
            Copy <FaRegCopy className="font-bold" />
          </button>
          {copied && <p className="text-green-500 text-sm mb-4">Copied!</p>}

          {/* Stats */}
          <div className="space-y-2 text-gray-700 mt-8">
            <p>
              <span className="font-bold">21</span> friends signed up
            </p>
            <p>
              <span className="font-bold">3</span> friends made a donation
            </p>
            <p>
              <span className="font-bold text-teal-600">Rs. 750</span> given to your friends!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
