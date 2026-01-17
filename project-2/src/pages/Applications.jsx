import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "../components/DataTable";
import DetailModal from "../components/DetailModal";
import API_URL from "../config";
import "../styles/Applications.css";

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
      
      setApps(userApps);
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
        alert("✅ Unapplied successfully!");
      } catch (error) {
        console.error("Error unapplying:", error);
        alert("❌ Error unapplying");
      }
    }
  };

  const handleRowClick = (item) => {
    setSelectedApplication(item);
    setShowModal(true);
  };

  if (isAdmin) {
    return null;
  }

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p className="applications-subtitle">Track all your job applications</p>
      </div>

      {apps.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any positions yet.</p>
        </div>
      ) : (
        <DataTable
          columns={["Title", "Company", "Duration"]}
          data={apps}
          renderActions={(item) => (
            <button 
              className="btn btn-sm btn-danger"
              onClick={() => remove(item)}
            >
              Unapply
            </button>
          )}
          onRowClick={handleRowClick}
        />
      )}

      <DetailModal
        show={showModal}
        data={selectedApplication}
        onHide={() => setShowModal(false)}
        onUnapply={remove}
        type="application"
      />
    </div>
  );
}