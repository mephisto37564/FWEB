import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "../components/DataTable";
import DetailModal from "../components/DetailModal";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  let userId = localStorage.getItem("userId");
  const isAdmin = role === "admin";

  // Debug log
  console.log("Current user ID:", userId);
  console.log("User role:", role);

  // Redirect admin to dashboard
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
      const res = await fetch("http://localhost:3000/applications");
      const data = await res.json();
      console.log("All applications from server:", data);
      console.log("Filtering for userId:", userId);
      
      // Filter to show only current user's applications
      const userApps = data.filter(app => {
        // Handle both cases: userId is a string (direct ID) or an object with _id
        const appUserId = typeof app.userId === "string" ? app.userId : app.userId?._id;
        const matches = appUserId === userId;
        console.log(`App userId: ${appUserId}, Current userId: ${userId}, Match: ${matches}`);
        return matches;
      });
      
      console.log("Filtered applications for this user:", userApps);
      setApps(userApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const remove = async (item) => {
    if (window.confirm("Are you sure you want to unapply?")) {
      try {
        // Delete the application
        await fetch(`http://localhost:3000/applications/${item._id}`, {
          method: "DELETE"
        });

        // Don't recreate the listing - it already exists in the listings table
        // Just remove from the user's applications
        setApps(prev => prev.filter(a => a._id !== item._id));
        alert("Unapplied successfully!");
      } catch (error) {
        console.error("Error unapplying:", error);
        alert("Error unapplying");
      }
    }
  };

  const handleRowClick = (item) => {
    setSelectedApplication(item);
    setShowModal(true);
  };

  if (isAdmin) {
    return null; // Don't render anything, will redirect
  }

  return (
    <>
      <h2>Applications</h2>

      <DataTable
        columns={["Title", "Company", "Duration"]}
        data={apps}
        renderActions={(item) => (
          <button 
            onClick={() => remove(item)}
            style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
          >
            Unapply
          </button>
        )}
        onRowClick={handleRowClick}
      />

      <DetailModal
        show={showModal}
        data={selectedApplication}
        onHide={() => setShowModal(false)}
        onUnapply={remove}
        type="application"
      />
    </>
  );
}