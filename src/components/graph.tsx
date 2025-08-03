import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const patientData = [
  { month: "Jan", visits: 40 },
  { month: "Feb", visits: 35 },
  { month: "Mar", visits: 50 },
  { month: "Apr", visits: 28 },
  { month: "May", visits: 55 },
  { month: "Jun", visits: 70 },
  { month: "Jul", visits: 56 },
  { month: "Aug", visits: 89 },
  { month: "Sep", visits: 35 },
  { month: "Oct", visits: 22 },
  { month: "Nov", visits: 38 },
  { month: "Dec", visits: 57 },
];

export default function Graph() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Patient Visit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patientData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#14B8A6"  radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
