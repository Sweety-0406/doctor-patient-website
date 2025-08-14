"use client";

import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

interface MonthlyTrend {
  month: string;
  rating: number; 
}

export function RatingTrendsChart({ data }: { data: MonthlyTrend[] }) {
  const chartConfig = {
    rating: {
      label: "Avg Rating",
      color: "#1bbba0ff", 
    },
  } satisfies ChartConfig;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Rating Trends</h3>
        <BarChart3 className="w-5 h-5 text-teal-600" />
      </div>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip />
          <Bar
            dataKey="rating"
            fill="var(--color-rating)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
