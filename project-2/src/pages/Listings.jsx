import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DataTable from "../components/DataTable";
import DetailModal from "../components/DetailModal";
import API_URL from "../config";
import "../styles/Listings.css";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [appliedListings, setAppliedListings] = useState(new Set());
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [filterType, setFilterType] = useState("all"); // all, job, company
  
  const role = localStorage.getItem("role");
  let userId = localStorage.getItem("userId");
  const isAdmin = role === "admin";

  useEffect(() => {
    fetchListings();
    if (!isAdmin) {
      fetchUserApplications();
    }
  }, [isAdmin, userId]);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/applications`);
      const data = await res.json();
      
      const userApps = data.filter(app => {
        const appUserId = typeof app.userId === "string" ? app.userId : app.userId?._id;
        return appUserId === userId;
      });
      
      const appliedTitles = new Set(userApps.map(app => app.title));
      setAppliedListings(appliedTitles);
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  const apply = async (item) => {
    try {
      const appResponse = await fetch(`${API_URL}/applications`, {
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

      setAppliedListings(prev => new Set([...prev, item.title]));
      setShowModal(false);
      alert("✅ Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      alert("❌ Error submitting application: " + error.message);
    }
  };

  const deleteListing = async (item) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await fetch(`${API_URL}/listings/${item._id}`, {
          method: "DELETE"
        });
        setListings(prev => prev.filter(l => l._id !== item._id));
        alert("✅ Listing deleted successfully");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("❌ Error deleting listing");
      }
    }
  };

  // Enhanced filtering logic - searches both title and company
  const filtered = listings.filter(l => {
    const titleMatch = l.title.toLowerCase().includes(search.toLowerCase());
    const companyMatch = l.company.toLowerCase().includes(search.toLowerCase());
    const notApplied = !appliedListings.has(l.title);
    
    // Admin sees all matching listings
    if (isAdmin) {
      return titleMatch || companyMatch;
    }
    
    // Users only see non-applied listings
    return notApplied && (titleMatch || companyMatch);
  });

  // Separate results by type for better organization
  const jobTitleMatches = filtered.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const companyMatches = filtered.filter(l =>
    l.company.toLowerCase().includes(search.toLowerCase()) &&
    !l.title.toLowerCase().includes(search.toLowerCase())
  );

  // Display order: job titles first, then companies
  const displayedListings = [...jobTitleMatches, ...companyMatches];

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
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/listings/edit/${item._id}`)}
        >
          ✏️ Edit
        </button>
      )
    },
    {
      label: "Delete",
      render: (item) => (
        <button 
          className="btn btn-sm btn-danger"
          onClick={() => deleteListing(item)}
        >
          🗑️ Delete
        </button>
      )
    }
  ];

  const userActions = [
    {
      label: "Apply",
      render: (item) => (
        <button 
          className="btn btn-sm btn-success"
          onClick={() => apply(item)}
        >
          ✓ Apply
        </button>
      )
    }
  ];

  return (
    <div className="listings-page">
      <div className="listings-header">
        <div>
          <h1>Job Opportunities</h1>
          <p className="listings-subtitle">Find and apply to amazing internship positions</p>
        </div>
      </div>

      <div className="listings-toolbar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search by job title, company..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        {isAdmin && (
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/listings/add")}
          >
            + Add Listing
          </button>
        )}
      </div>

      {/* Search Results Summary */}
      {search && (
        <div className="search-summary">
          <p>
            Found <strong>{displayedListings.length}</strong> result{displayedListings.length !== 1 ? 's' : ''} for "<strong>{search}</strong>"
          </p>
          {jobTitleMatches.length > 0 && companyMatches.length > 0 && (
            <p className="results-breakdown">
              <span className="result-badge job-badge">{jobTitleMatches.length} Job Title{jobTitleMatches.length !== 1 ? 's' : ''}</span>
              <span className="result-badge company-badge">{companyMatches.length} Company{companyMatches.length !== 1 ? 'ies' : ''}</span>
            </p>
          )}
        </div>
      )}

      {displayedListings.length === 0 ? (
        <div className="empty-state">
          <p>No listings found. Try adjusting your search.</p>
        </div>
      ) : (
        <>
          {/* Job Title Matches Section */}
          {jobTitleMatches.length > 0 && (
            <div className="results-section">
              {search && <h3 className="section-label">📋 Matching Job Titles</h3>}
              <DataTable
                columns={["Title", "Company", "Duration"]}
                data={jobTitleMatches}
                actions={isAdmin ? adminActions : userActions}
                onRowClick={handleRowClick}
              />
            </div>
          )}

          {/* Company Matches Section */}
          {companyMatches.length > 0 && (
            <div className="results-section">
              <h3 className="section-label">🏢 Matching Companies</h3>
              <DataTable
                columns={["Title", "Company", "Duration"]}
                data={companyMatches}
                actions={isAdmin ? adminActions : userActions}
                onRowClick={handleRowClick}
              />
            </div>
          )}
        </>
      )}

      <DetailModal
        show={showModal}
        data={selectedListing}
        onHide={() => setShowModal(false)}
        onApply={apply}
        type="listing"
        isAdmin={isAdmin}
      />
    </div>
  );
}