import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import TimelineChart from "../components/TimelineChart";
import BarChartComponent from "../components/BarChartComponent";
import API_URL from "../config";
import "../styles/Dashboard.css";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/dashboard/user/${userId}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Failed to load dashboard data</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>My Applications Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Applications"
          value={dashboardData.totalApplications}
          color="blue"
          subtitle="Jobs applied to"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {dashboardData.timelineData && dashboardData.timelineData.length > 0 && (
          <div className="chart-wrapper">
            <TimelineChart
              data={dashboardData.timelineData}
              title="Application Timeline"
            />
          </div>
        )}

        {dashboardData.applicationsByCompany && dashboardData.applicationsByCompany.length > 0 && (
          <div className="chart-wrapper">
            <BarChartComponent
              data={dashboardData.applicationsByCompany}
              title="Applications by Company"
              dataKey="count"
            />
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <div className="recent-applications-container">
        <h3>Recent Applications</h3>
        {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Duration</th>
                <th>Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentApplications.map((app) => (
                <tr key={app._id}>
                  <td>{app.title}</td>
                  <td>{app.company}</td>
                  <td>{app.duration}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No applications yet</p>
        )}
      </div>
    </div>
  );
}
