import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import TimelineChart from "../components/TimelineChart";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import API_URL from "../config";
import "../styles/Dashboard.css";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/dashboard/admin`);
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
      <h1>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Listings"
          value={dashboardData.totalListings}
          color="blue"
          subtitle="Active job postings"
        />
        <StatsCard
          title="Total Applications"
          value={dashboardData.totalApplications}
          color="green"
          subtitle="Submitted applications"
        />
        <StatsCard
          title="Active Users"
          value={dashboardData.totalActiveUsers}
          color="purple"
          subtitle="Users who applied"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {dashboardData.timelineData && dashboardData.timelineData.length > 0 && (
          <div className="chart-wrapper">
            <TimelineChart
              data={dashboardData.timelineData}
              title="Applications Over Time"
            />
          </div>
        )}

        {dashboardData.mostAppliedListings && dashboardData.mostAppliedListings.length > 0 && (
          <div className="chart-wrapper">
            <BarChartComponent
              data={dashboardData.mostAppliedListings.map((item) => ({
                name: item.title,
                applications: item.applications,
              }))}
              title="Most Applied Listings (Top 5)"
              dataKey="applications"
            />
          </div>
        )}

        {dashboardData.jobCategoriesDistribution && dashboardData.jobCategoriesDistribution.length > 0 && (
          <div className="chart-wrapper">
            <PieChartComponent
              data={dashboardData.jobCategoriesDistribution}
              title="Job Categories Distribution"
            />
          </div>
        )}
      </div>
    </div>
  );
}
