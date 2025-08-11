"use client";

interface StatusIndicatorProps {
  status: string;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  let filled = 0;
  let color = "bg-gray-300";
  let textColor = "text-gray-400";

  switch (status.toLowerCase()) {
    case "pending":
      filled = 1;
      color = "bg-yellow-100";
      textColor = "text-yellow-500";
      break;
    case "approved":
      filled = 2;
      color = "bg-green-100";
      textColor = "text-green-500";
      break;
    // case "cancel":
    // case "reschedule":
    case "cancelled":
      filled = 2;
      color = "bg-orange-100";
      textColor = "text-orange-500";
      break;
    case "reschedule":
      filled = 2;
      color = "bg-violet-100";
      textColor = "text-violet-500";
      break;
    case "rejected":
      filled = 2;
      color = "bg-red-100";
      textColor = "text-red-500";
      break;
    case "completed":
      filled = 3;
      color = "bg-blue-100";
      textColor = "text-blue-500";
      break;
  }

  return (
    <div className="flex items-center gap-4">
      {/* Status Label */}
      <span className={`text-sm font-semibold px-2 py-1 rounded-md ${color} ${textColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      {/* Circle chain */}
      {/* <div className="flex items-center w-full w-xs">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center w-full">
            <div
              className={`size-3 rounded-full ${
                i < filled ? color : "bg-gray-300"
              }`}
            />
            {i < 2 && (
              <div
                className={`h-[2px] w-full ${
                  i < filled - 1 ? color : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div> */}
    </div>
  );
}
