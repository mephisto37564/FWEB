import React from "react";
import "../styles/StatsCard.css";

export default function StatsCard({ title, value, color = "default", subtitle = "" }) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <h3 className="stats-card-title">{title}</h3>
      </div>
      <div className="stats-card-value">{value}</div>
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
    </div>
  );
}
