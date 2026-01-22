import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Briefcase, Building2, Trash2 } from "lucide-react";
import API_URL from "../config";
import "../styles/Pages.css";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  let userId = localStorage.getItem("userId");
  const isAdmin = role === "admin";

  useEffect(() => {
    if (isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/applications`);
      const data = await res.json();
      
      const userApps = data.filter(app => {
        const appUserId = typeof app.userId === "string" ? app.userId : app.userId?._id;
        return appUserId === userId;
      });
      
      // Sort by most recent first
      const sorted = userApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApps(sorted);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const remove = async (item) => {
    if (window.confirm("Are you sure you want to unapply?")) {
      try {
        await fetch(`${API_URL}/applications/${item._id}`, {
          method: "DELETE"
        });

        setApps(prev => prev.filter(a => a._id !== item._id));
        setShowModal(false);
        alert("✅ Unapplied successfully!");
      } catch (error) {
        console.error("Error unapplying:", error);
        alert("❌ Error unapplying");
      }
    }
  };

  const handleCardClick = (item) => {
    setSelectedApplication(item);
    setShowModal(true);
  };

  if (isAdmin) {
    return null;
  }

  return (
    <div className="applications-page">
      <div className="applications-header">
        <div>
          <h1>📋 My Applications</h1>
          <p className="applications-subtitle">Track all your job applications</p>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any positions yet.</p>
          <p style={{ marginTop: "1rem", fontSize: "14px" }}>
            <a href="/listings" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
              Browse available jobs →
            </a>
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "2rem", fontSize: "14px", color: "#999" }}>
            Total Applications: <strong style={{ color: "#333" }}>{apps.length}</strong>
          </div>

          <div className="applications-grid">
            {apps.map(app => (
              <div 
                key={app._id} 
                className="application-card"
                onClick={() => handleCardClick(app)}
              >
                <div className="app-card-header">
                  <div className="app-job-info">
                    <h3>{app.title}</h3>
                    <p>{app.company}</p>
                  </div>
                  <div className="app-duration-badge">{app.duration}</div>
                </div>

                <div className="app-card-body">
                  {app.description && (
                    <p className="app-description">{app.description}</p>
                  )}
                  
                  <div className="app-meta">
                    <div className="app-meta-item">
                      📅 {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    <div className="app-meta-item">
                      ⏱️ {app.duration}
                    </div>
                  </div>
                </div>

                <div className="app-card-footer">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(app);
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(app);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Unapply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedApplication.title}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Position Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Title</label>
                    <p>{selectedApplication.title}</p>
                  </div>
                  <div className="detail-item">
                    <label>Company</label>
                    <p>{selectedApplication.company}</p>
                  </div>
                  <div className="detail-item">
                    <label>Duration</label>
                    <p>{selectedApplication.duration}</p>
                  </div>
                  <div className="detail-item">
                    <label>Description</label>
                    <p>{selectedApplication.description}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Application Info</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Applied On</label>
                    <p>{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => remove(selectedApplication)}
              >
                Remove Application
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}