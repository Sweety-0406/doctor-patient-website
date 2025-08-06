"use client";

import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

export default function InviteFriendsPage() {
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
    alert(`Invites sent to: ${emails}`);
    setEmails("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-teal-500 z-0 absolute w-full text-white text-center py-8 px-4">
        <h1 className="text-3xl font-bold">Invite friends, give $25</h1>
        <p className="mt-2 text-sm">
          Each friend that joins and donates with your link will get $25 for their second donation to help any nonprofit.
        </p>
      </div>

      <div className="max-w-6xl relative pt-40 z-10 mx-auto flex flex-col lg:flex-row gap-8 p-6">
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
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Send invites
            </button>
          </div>
          <h3 className="font-medium mb-2">Invited</h3>
          <div className="space-y-3">
            {invitedUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
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
          <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 mb-4">
            <span className="text-gray-600 text-sm truncate">{inviteLink}</span>
            <button onClick={handleCopy} className="text-teal-500 hover:text-teal-700">
              <FaRegCopy />
            </button>
          </div>
          {copied && <p className="text-green-500 text-sm mb-4">Copied!</p>}

          {/* Stats */}
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-bold">21</span> friends signed up
            </p>
            <p>
              <span className="font-bold">3</span> friends made a donation
            </p>
            <p>
              <span className="font-bold text-green-600">$75</span> given to your friends!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
