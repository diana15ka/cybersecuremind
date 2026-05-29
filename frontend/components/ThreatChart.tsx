"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ThreatChart({ data }: any) {
  return (
    <div className="w-full min-w-0 h-[300px] min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="threats" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}