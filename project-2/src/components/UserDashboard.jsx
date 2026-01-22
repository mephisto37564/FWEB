import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Briefcase, Target, Award } from "lucide-react";
import StatsCard from "../components/StatsCard";
import TimelineChart from "../components/TimelineChart";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import API_URL from "../config";
import "../styles/Dashboard.css";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user data
      const userRes = await fetch(`${API_URL}/users/${userId}`);
      const userData = await userRes.json();

      // Fetch user's applications
      const appsRes = await fetch(`${API_URL}/applications`);
      const appsData = await appsRes.json();

      const userApps = appsData.filter(
        app => app.userId === userId || app.userId?._id === userId
      );

      // Fetch all listings to compare
      const listingsRes = await fetch(`${API_URL}/listings`);
      const listingsData = await listingsRes.json();

      // Calculate stats
      const totalListings = listingsData.length;
      const totalApplications = userApps.length;
      const applicationRate = totalListings > 0 
        ? ((totalApplications / totalListings) * 100).toFixed(2)
        : 0;

      // Analyze by company
      const applicationsByCompany = {};
      userApps.forEach(app => {
        if (!applicationsByCompany[app.company]) {
          applicationsByCompany[app.company] = 0;
        }
        applicationsByCompany[app.company]++;
      });

      const companyData = Object.entries(applicationsByCompany).map(([company, count]) => ({
        name: company,
        count
      })).sort((a, b) => b.count - a.count);

      // Analyze by duration
      const applicationsByDuration = {};
      userApps.forEach(app => {
        if (!applicationsByDuration[app.duration]) {
          applicationsByDuration[app.duration] = 0;
        }
        applicationsByDuration[app.duration]++;
      });

      const durationData = Object.entries(applicationsByDuration).map(([duration, count]) => ({
        name: duration,
        count
      }));

      // Get recent applications
      const recentApplications = userApps
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      // Get statistics
      const appliedListings = listingsData.filter(listing =>
        userApps.some(app => app.title === listing.title)
      );

      const notAppliedListings = listingsData.filter(listing =>
        !userApps.some(app => app.title === listing.title)
      );

      // Best opportunities (most competitive jobs user applied to)
      const jobApplicationCounts = {};
      appsData.forEach(app => {
        if (!jobApplicationCounts[app.title]) {
          jobApplicationCounts[app.title] = 0;
        }
        jobApplicationCounts[app.title]++;
      });

      const userAppsWithCompetition = userApps.map(app => ({
        ...app,
        competition: jobApplicationCounts[app.title] || 0
      }));

      const mostCompetitiveJobs = userAppsWithCompetition
        .sort((a, b) => b.competition - a.competition)
        .slice(0, 5);

      const leastCompetitiveJobs = userAppsWithCompetition
        .sort((a, b) => a.competition - b.competition)
        .slice(0, 5);

      setDashboardData({
        user: userData,
        totalApplications,
        totalListings,
        applicationRate,
        appliedCount: appliedListings.length,
        notAppliedCount: notAppliedListings.length,
        companyData,
        durationData,
        recentApplications,
        applicationsByCompany,
        applicationsByDuration,
        mostCompetitiveJobs,
        leastCompetitiveJobs
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Failed to load dashboard data</div>;
  }

  return (
    <div className="dashboard-container user-dashboard">
      {/* Header */}
      <div className="user-dashboard-header">
        <div>
          <h1>👋 Welcome, {dashboardData.user?.name}!</h1>
          <p className="dashboard-subtitle">Track your applications and opportunities</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === "opportunities" ? "active" : ""}`}
          onClick={() => setActiveTab("opportunities")}
        >
          🎯 Opportunities
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="stats-grid">
            <StatsCard
              title="Total Applications"
              value={dashboardData.totalApplications}
              color="blue"
              subtitle="Jobs you applied to"
              icon="📝"
            />
            <StatsCard
              title="Available Listings"
              value={dashboardData.notAppliedCount}
              color="green"
              subtitle="Jobs not yet applied"
              icon="🔓"
            />
            <StatsCard
              title="Application Rate"
              value={`${dashboardData.applicationRate}%`}
              color="purple"
              subtitle={`${dashboardData.appliedCount} / ${dashboardData.totalListings} listings`}
              icon="🎯"
            />
          </div>

          {/* Charts */}
          <div className="charts-grid">
            {dashboardData.companyData && dashboardData.companyData.length > 0 && (
              <div className="chart-wrapper">
                <BarChartComponent
                  data={dashboardData.companyData}
                  title="Applications by Company"
                  dataKey="count"
                />
              </div>
            )}

            {dashboardData.durationData && dashboardData.durationData.length > 0 && (
              <div className="chart-wrapper">
                <BarChartComponent
                  data={dashboardData.durationData}
                  title="Applications by Duration"
                  dataKey="count"
                />
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="recent-applications-container">
            <h3>📋 Recent Applications</h3>
            {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Duration</th>
                    <th>Applied On</th>
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
        </>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <>
          <div className="analytics-section">
            <h2>📈 Your Application Analytics</h2>

            {/* Summary Cards */}
            <div className="analytics-summary">
              <div className="analytics-card">
                <div className="card-icon">📝</div>
                <div className="card-content">
                  <label>Total Applications</label>
                  <div className="card-value">{dashboardData.totalApplications}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">🏢</div>
                <div className="card-content">
                  <label>Companies Applied To</label>
                  <div className="card-value">{dashboardData.companyData.length}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">⏱️</div>
                <div className="card-content">
                  <label>Duration Types</label>
                  <div className="card-value">{dashboardData.durationData.length}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <label>Coverage Rate</label>
                  <div className="card-value">{dashboardData.applicationRate}%</div>
                </div>
              </div>
            </div>

            {/* Company Breakdown */}
            <div className="breakdown-section">
              <h3>Companies Breakdown</h3>
              <div className="breakdown-table">
                <div className="breakdown-header">
                  <div className="col">Company</div>
                  <div className="col">Applications</div>
                  <div className="col">Percentage</div>
                </div>
                {dashboardData.companyData.map((company) => (
                  <div key={company.name} className="breakdown-row">
                    <div className="col">{company.name}</div>
                    <div className="col">
                      <span className="count-badge">{company.count}</span>
                    </div>
                    <div className="col">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${(company.count / dashboardData.totalApplications) * 100}%` }}
                        ></div>
                      </div>
                      {((company.count / dashboardData.totalApplications) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Breakdown */}
            <div className="breakdown-section">
              <h3>Duration Breakdown</h3>
              <div className="breakdown-table">
                <div className="breakdown-header">
                  <div className="col">Duration</div>
                  <div className="col">Applications</div>
                  <div className="col">Percentage</div>
                </div>
                {dashboardData.durationData.map((duration) => (
                  <div key={duration.name} className="breakdown-row">
                    <div className="col">{duration.name}</div>
                    <div className="col">
                      <span className="count-badge">{duration.count}</span>
                    </div>
                    <div className="col">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${(duration.count / dashboardData.totalApplications) * 100}%` }}
                        ></div>
                      </div>
                      {((duration.count / dashboardData.totalApplications) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* OPPORTUNITIES TAB */}
      {activeTab === "opportunities" && (
        <>
          <div className="opportunities-section">
            <h2>🎯 Your Opportunities</h2>

            {/* Most Competitive */}
            <div className="opportunities-subsection">
              <h3>🏆 Most Competitive (by applications)</h3>
              <div className="opportunities-list">
                {dashboardData.mostCompetitiveJobs && dashboardData.mostCompetitiveJobs.length > 0 ? (
                  dashboardData.mostCompetitiveJobs.map((job, idx) => (
                    <div key={job._id} className="opportunity-card competitive">
                      <div className="opportunity-rank">#{idx + 1}</div>
                      <div className="opportunity-content">
                        <h4>{job.title}</h4>
                        <p className="opportunity-company">{job.company}</p>
                        <div className="opportunity-meta">
                          <span className="meta-item">📦 {job.duration}</span>
                          <span className="meta-item">👥 {job.competition} competitors</span>
                        </div>
                      </div>
                      <div className="competition-level">
                        <div className="competition-bar">
                          <div 
                            className="competition-fill"
                            style={{ width: `${Math.min((job.competition / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No competitive jobs yet</p>
                )}
              </div>
            </div>

            {/* Least Competitive */}
            <div className="opportunities-subsection">
              <h3>🌟 Hidden Gems (Least competitive)</h3>
              <div className="opportunities-list">
                {dashboardData.leastCompetitiveJobs && dashboardData.leastCompetitiveJobs.length > 0 ? (
                  dashboardData.leastCompetitiveJobs.map((job, idx) => (
                    <div key={job._id} className="opportunity-card gem">
                      <div className="opportunity-rank">✨</div>
                      <div className="opportunity-content">
                        <h4>{job.title}</h4>
                        <p className="opportunity-company">{job.company}</p>
                        <div className="opportunity-meta">
                          <span className="meta-item">📦 {job.duration}</span>
                          <span className="meta-item">👥 Only {job.competition} competitors</span>
                        </div>
                      </div>
                      <div className="competition-level">
                        <div className="competition-badge">Low Competition</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No applications yet</p>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="insights-section">
              <h3>💡 Insights</h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <p>You've applied to <strong>{dashboardData.applicationRate}%</strong> of all available listings</p>
                </div>
                <div className="insight-card">
                  <p>You're most interested in <strong>{dashboardData.companyData[0]?.name}</strong> (
                    {dashboardData.companyData[0]?.count} applications)</p>
                </div>
                <div className="insight-card">
                  <p>Preferred duration: <strong>{dashboardData.durationData[0]?.name}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}