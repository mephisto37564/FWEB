import { useEffect, useState } from "react";
import { TrendingUp, BarChart3, PieChart, Users, Briefcase, Target } from "lucide-react";
import StatsCard from "../components/StatsCard";
import TimelineChart from "../components/TimelineChart";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import API_URL from "../config";
import "../styles/Dashboard.css";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard summary
      const dashRes = await fetch(`${API_URL}/dashboard/admin`);
      const dashData = await dashRes.json();
      
      // Fetch all listings and applications for conversion calculation
      const listingsRes = await fetch(`${API_URL}/listings`);
      const listingsData = await listingsRes.json();
      
      const appsRes = await fetch(`${API_URL}/applications`);
      const appsData = await appsRes.json();
      
      // Calculate conversion rates
      const conversionRate = listingsData.length > 0 
        ? ((appsData.length / listingsData.length) * 100).toFixed(2)
        : 0;
      
      // Per-company conversion analysis
      const companyListings = {};
      const companyApplications = {};
      
      // Group listings by company
      listingsData.forEach(job => {
        if (!companyListings[job.company]) {
          companyListings[job.company] = [];
        }
        companyListings[job.company].push(job);
      });
      
      // Count applications by company
      appsData.forEach(app => {
        if (!companyApplications[app.company]) {
          companyApplications[app.company] = [];
        }
        companyApplications[app.company].push(app);
      });
      
      // Calculate per-company conversion
      const jobConversions = Object.keys(companyListings).map(company => {
        const numListings = companyListings[company].length;
        const numApplications = companyApplications[company] ? companyApplications[company].length : 0;
        const rate = numListings > 0 
          ? Math.min(((numApplications / numListings) * 100), 100).toFixed(2)
          : 0;
        
        return {
          _id: company,
          title: company,
          company: company,
          totalApplications: numApplications,
          totalListings: numListings,
          conversionRate: rate,
          applicants: companyApplications[company] || []
        };
      }).sort((a, b) => b.totalApplications - a.totalApplications);
      
      const uniqueJobs = jobConversions;
      
      // Most popular companies
      const companyStats = {};
      listingsData.forEach(job => {
        if (!companyStats[job.company]) {
          companyStats[job.company] = { listings: 0, applications: 0 };
        }
        companyStats[job.company].listings++;
        const companyApps = appsData.filter(app => app.company === job.company);
        companyStats[job.company].applications = companyApps.length;
      });
      
      const companiesData = Object.entries(companyStats).map(([company, stats]) => ({
        name: company,
        listings: stats.listings,
        applications: stats.applications,
        conversionRate: stats.listings > 0 
          ? Math.min(((stats.applications / stats.listings) * 100), 100).toFixed(2) // Cap at 100%
          : 0
      })).sort((a, b) => b.applications - a.applications);
      
      // Job duration analysis
      const durationStats = {};
      listingsData.forEach(job => {
        if (!durationStats[job.duration]) {
          durationStats[job.duration] = { count: 0, applications: 0 };
        }
        durationStats[job.duration].count++;
        const durationApps = appsData.filter(app => app.duration === job.duration);
        durationStats[job.duration].applications = durationApps.length;
      });
      
      setDashboardData({
        ...dashData,
        totalListings: listingsData.length,
        totalApplications: appsData.length,
        overallConversionRate: conversionRate,
        jobConversions: uniqueJobs,
        companiesData,
        durationStats
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJobId(job._id);
    setJobDetails(job);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Failed to load dashboard data</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p className="dashboard-subtitle">Real-time analytics and performance metrics</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📈 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === "conversions" ? "active" : ""}`}
          onClick={() => setActiveTab("conversions")}
        >
          🎯 Conversion Analysis
        </button>
        <button 
          className={`tab-button ${activeTab === "performance" ? "active" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          ⚡ Performance Metrics
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="stats-grid">
            <StatsCard
              title="Total Listings"
              value={dashboardData.totalListings}
              color="blue"
              subtitle="Active job postings"
              icon="📋"
            />
            <StatsCard
              title="Total Applications"
              value={dashboardData.totalApplications}
              color="green"
              subtitle="Submitted applications"
              icon="📝"
            />
            <StatsCard
              title="Active Users"
              value={dashboardData.totalActiveUsers || 0}
              color="purple"
              subtitle="Users who applied"
              icon="👥"
            />
            <div className="stats-card stats-card-orange">
              <div className="stats-card-header">
                <h3 className="stats-card-title">Overall Conversion Rate</h3>
              </div>
              <div className="stats-card-value">{dashboardData.overallConversionRate}%</div>
              <p className="stats-card-subtitle">Apps per listing</p>
            </div>
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
        </>
      )}

      {/* CONVERSION ANALYSIS TAB */}
      {activeTab === "conversions" && (
        <>
          <div className="conversion-section">
            <h2>🎯 Conversion Rate Analysis</h2>
            
            {/* Conversion Summary */}
            <div className="conversion-summary">
              <div className="conversion-card">
                <div className="conversion-stat">
                  <label>Overall Conversion Rate</label>
                  <div className="conversion-value">{dashboardData.overallConversionRate}%</div>
                  <p className="conversion-meta">{dashboardData.totalApplications} / {dashboardData.totalListings} listings</p>
                </div>
              </div>

              <div className="conversion-card">
                <div className="conversion-stat">
                  <label>Average Apps per Job</label>
                  <div className="conversion-value">
                    {dashboardData.totalListings > 0 
                      ? (dashboardData.totalApplications / dashboardData.totalListings).toFixed(1)
                      : 0
                    }
                  </div>
                  <p className="conversion-meta">Per job listing</p>
                </div>
              </div>

              <div className="conversion-card">
                <div className="conversion-stat">
                  <label>Best Performing Company</label>
                  <div className="conversion-value">
                    {dashboardData.jobConversions && dashboardData.jobConversions.length > 0
                      ? dashboardData.jobConversions[0].totalApplications
                      : 0
                    }
                  </div>
                  <p className="conversion-meta">
                    {dashboardData.jobConversions && dashboardData.jobConversions.length > 0
                      ? dashboardData.jobConversions[0].company
                      : "N/A"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Company Conversion */}
            <div className="conversion-table-wrapper">
              <h3>Companies by Conversion Performance</h3>
              <div className="conversion-table">
                <div className="table-header">
                  <div className="col-rank">Rank</div>
                  <div className="col-job">Company</div>
                  <div className="col-company">Listings</div>
                  <div className="col-apps">Applications</div>
                  <div className="col-rate">Conversion</div>
                  <div className="col-action">Action</div>
                </div>
                {dashboardData.jobConversions && dashboardData.jobConversions.map((company, idx) => (
                  <div key={company._id} className="table-row">
                    <div className="col-rank">
                      <span className="rank-badge">#{idx + 1}</span>
                    </div>
                    <div className="col-job">{company.company}</div>
                    <div className="col-company">{company.totalListings}</div>
                    <div className="col-apps">
                      <span className="app-count">{company.totalApplications}</span>
                    </div>
                    <div className="col-rate">
                      <div className="rate-bar-container">
                        <div 
                          className="rate-bar" 
                          style={{ width: `${Math.min(company.conversionRate, 100)}%` }}
                        ></div>
                      </div>
                      <span className="rate-text">{company.conversionRate}%</span>
                    </div>
                    <div className="col-action">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleJobSelect(company)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Conversion Analysis */}
            <div className="conversion-table-wrapper" style={{ marginTop: "2rem" }}>
              <h3>Companies by Performance</h3>
              <div className="conversion-table">
                <div className="table-header">
                  <div className="col-company" style={{ flex: 2 }}>Company</div>
                  <div className="col-apps">Listings</div>
                  <div className="col-apps">Applications</div>
                  <div className="col-rate">Conversion Rate</div>
                </div>
                {dashboardData.companiesData && dashboardData.companiesData.map((company) => (
                  <div key={company.name} className="table-row">
                    <div className="col-company" style={{ flex: 2 }}>{company.name}</div>
                    <div className="col-apps">{company.listings}</div>
                    <div className="col-apps">{company.applications}</div>
                    <div className="col-rate">
                      <div className="rate-bar-container">
                        <div 
                          className="rate-bar" 
                          style={{ width: `${Math.min(company.conversionRate, 100)}%` }}
                        ></div>
                      </div>
                      <span className="rate-text">{company.conversionRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* PERFORMANCE METRICS TAB */}
      {activeTab === "performance" && (
        <>
          <div className="performance-section">
            <h2>⚡ Performance Metrics</h2>
            
            <div className="charts-grid">
              {dashboardData.mostAppliedListings && dashboardData.mostAppliedListings.length > 0 && (
                <div className="chart-wrapper">
                  <BarChartComponent
                    data={dashboardData.mostAppliedListings.map((item) => ({
                      name: item.title,
                      applications: item.applications,
                    }))}
                    title="Top 5 Most Applied Jobs"
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

            {/* Duration Analysis */}
            <div className="duration-analysis">
              <h3>Job Duration Performance</h3>
              <div className="duration-cards">
                {dashboardData.durationStats && Object.entries(dashboardData.durationStats).map(([duration, stats]) => (
                  <div key={duration} className="duration-card">
                    <div className="duration-header">
                      <h4>{duration}</h4>
                    </div>
                    <div className="duration-stat">
                      <div className="stat-row">
                        <span>Listings:</span>
                        <strong>{stats.count}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Applications:</span>
                        <strong>{stats.applications}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Avg per Listing:</span>
                        <strong>{(stats.applications / stats.count).toFixed(1)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Job Detail Modal */}
      {selectedJobId && jobDetails && (
        <div className="modal-overlay" onClick={() => setSelectedJobId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{jobDetails.title}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedJobId(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <label>Company</label>
                <p>{jobDetails.company}</p>
              </div>
              <div className="modal-section">
                <label>Applications</label>
                <p className="highlight">{jobDetails.totalApplications}</p>
              </div>
              <div className="modal-section">
                <label>Conversion Rate</label>
                <p className="highlight">{jobDetails.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}