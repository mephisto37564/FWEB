import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DataTable from "../components/DataTable";
import DetailModal from "../components/DetailModal";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [appliedListings, setAppliedListings] = useState(new Set());
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  
  const role = localStorage.getItem("role");
  let userId = localStorage.getItem("userId");
  const isAdmin = role === "admin";

  // Debug log
  console.log("Current user ID:", userId);
  console.log("User role:", role);

  useEffect(() => {
    fetchListings();
    if (!isAdmin) {
      fetchUserApplications();
    }
  }, [isAdmin, userId]);

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:3000/listings");
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const res = await fetch("http://localhost:3000/applications");
      const data = await res.json();
      
      // Get titles of jobs user has already applied for
      const userApps = data.filter(app => {
        const appUserId = typeof app.userId === "string" ? app.userId : app.userId?._id;
        return appUserId === userId;
      });
      
      const appliedTitles = new Set(userApps.map(app => app.title));
      setAppliedListings(appliedTitles);
      console.log("User has applied for:", appliedTitles);
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  const apply = async (item) => {
    try {
      // Create an application
      const appResponse = await fetch("http://localhost:3000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          company: item.company,
          duration: item.duration,
          description: item.description,
          userId: userId
        })
      });

      if (!appResponse.ok) {
        throw new Error("Failed to create application");
      }

      const appData = await appResponse.json();
      console.log("Application created:", appData);

      // Add to applied listings set
      setAppliedListings(prev => new Set([...prev, item.title]));
      setShowModal(false);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Error submitting application: " + error.message);
    }
  };

  const deleteListing = async (item) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await fetch(`http://localhost:3000/listings/${item._id}`, {
          method: "DELETE"
        });
        setListings(prev => prev.filter(l => l._id !== item._id));
        alert("Listing deleted successfully");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Error deleting listing");
      }
    }
  };

  // Filter listings: exclude applied ones for users, search by title
  const filtered = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const notApplied = !appliedListings.has(l.title);
    
    // Show all listings to admin, but hide applied ones for users
    if (isAdmin) {
      return matchesSearch;
    }
    return matchesSearch && notApplied;
  });

  const handleSearchChange = (value) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleRowClick = (item) => {
    setSelectedListing(item);
    setShowModal(true);
  };

  const adminActions = [
    {
      label: "Edit",
      render: (item) => (
        <button onClick={() => navigate(`/listings/edit/${item._id}`)}>
          Edit
        </button>
      )
    },
    {
      label: "Delete",
      render: (item) => (
        <button 
          onClick={() => deleteListing(item)}
          style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
        >
          Delete
        </button>
      )
    }
  ];

  const userActions = [
    {
      label: "Apply",
      render: (item) => (
        <button onClick={() => apply(item)}>
          Apply
        </button>
      )
    }
  ];

  return (
    <>
      <h2>Listings</h2>

      <div style={toolbarStyle}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
        {isAdmin && (
          <button onClick={() => navigate("/listings/add")}>
            Add Listing
          </button>
        )}
      </div>

      <DataTable
        columns={["Title", "Company", "Duration"]}
        data={filtered}
        actions={isAdmin ? adminActions : userActions}
        onRowClick={handleRowClick}
      />

      <DetailModal
        show={showModal}
        data={selectedListing}
        onHide={() => setShowModal(false)}
        onApply={apply}
        type="listing"
        isAdmin={isAdmin}
      />
    </>
  );
}

const toolbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
  gap: "1rem"
};