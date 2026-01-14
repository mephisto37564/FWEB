import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Charts.css";

export default function TimelineChart({ data, title = "Applications Over Time" }) {
  // Format the data for display
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    }),
    applications: item.applications,
  }));

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#8884d8"
            dot={{ fill: "#8884d8", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
