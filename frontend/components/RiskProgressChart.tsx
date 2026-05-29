"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function RiskProgressChart({ data }: any) {
  return (
    <div className="w-full h-[240px] min-h-[240px]">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data || []} barSize={42}>
          <defs>
            <linearGradient id="riskBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#27272a" strokeDasharray="4 4" />
          <XAxis
            dataKey="stage"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              color: "#e4e4e7",
            }}
            cursor={{ fill: "rgba(56, 189, 248, 0.08)" }}
          />
          <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="url(#riskBlue)">
            {(data || []).map((_: any, index: number) => (
              <Cell key={index} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}