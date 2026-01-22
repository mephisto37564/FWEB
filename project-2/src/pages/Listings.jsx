import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { MapPin, Clock, Briefcase, Edit2, Trash2, CheckCircle } from "lucide-react";
import API_URL from "../config";
import "../styles/Pages.css";

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

  // Enhanced filtering logic
  const filtered = listings.filter(l => {
    const titleMatch = l.title.toLowerCase().includes(search.toLowerCase());
    const companyMatch = l.company.toLowerCase().includes(search.toLowerCase());
    const notApplied = !appliedListings.has(l.title);
    
    if (isAdmin) {
      return titleMatch || companyMatch;
    }
    
    return notApplied && (titleMatch || companyMatch);
  });

  const jobTitleMatches = filtered.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const companyMatches = filtered.filter(l =>
    l.company.toLowerCase().includes(search.toLowerCase()) &&
    !l.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedListings = [...jobTitleMatches, ...companyMatches];

  const handleSearchChange = (value) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleCardClick = (item) => {
    setSelectedListing(item);
    setShowModal(true);
  };

  return (
    <div className="listings-page">
      <div className="listings-header">
        <div>
          <h1>💼 Job Opportunities</h1>
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
          {/* Job Title Matches */}
          {jobTitleMatches.length > 0 && (
            <div className="results-section">
              {search && <h3 className="section-label">📋 Matching Job Titles</h3>}
              <div className="listings-grid">
                {jobTitleMatches.map(job => (
                  <div 
                    key={job._id}
                    className="listing-card"
                    onClick={() => handleCardClick(job)}
                  >
                    <div className="listing-card-header">
                      <div className="listing-job-info">
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                      </div>
                      <div className="listing-duration-badge">{job.duration}</div>
                    </div>

                    <div className="listing-card-body">
                      {job.description && (
                        <p className="listing-description">{job.description}</p>
                      )}
                      
                      <div className="listing-meta">
                        <div className="listing-meta-item">
                          <Briefcase className="w-3 h-3" /> {job.company}
                        </div>
                        <div className="listing-meta-item">
                          <Clock className="w-3 h-3" /> {job.duration}
                        </div>
                      </div>
                    </div>

                    <div className="listing-card-footer">
                      {appliedListings.has(job.title) ? (
                        <div className="listing-applied-badge">
                          <CheckCircle className="w-4 h-4" style={{ display: "inline", marginRight: "0.25rem" }} />
                          Applied
                        </div>
                      ) : isAdmin ? (
                        <>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/listings/edit/${job._id}`);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteListing(job);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={(e) => {
                            e.stopPropagation();
                            apply(job);
                          }}
                        >
                          ✓ Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Matches */}
          {companyMatches.length > 0 && (
            <div className="results-section">
              <h3 className="section-label">🏢 Matching Companies</h3>
              <div className="listings-grid">
                {companyMatches.map(job => (
                  <div 
                    key={job._id}
                    className="listing-card"
                    onClick={() => handleCardClick(job)}
                  >
                    <div className="listing-card-header">
                      <div className="listing-job-info">
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                      </div>
                      <div className="listing-duration-badge">{job.duration}</div>
                    </div>

                    <div className="listing-card-body">
                      {job.description && (
                        <p className="listing-description">{job.description}</p>
                      )}
                      
                      <div className="listing-meta">
                        <div className="listing-meta-item">
                          <Briefcase className="w-3 h-3" /> {job.company}
                        </div>
                        <div className="listing-meta-item">
                          <Clock className="w-3 h-3" /> {job.duration}
                        </div>
                      </div>
                    </div>

                    <div className="listing-card-footer">
                      {appliedListings.has(job.title) ? (
                        <div className="listing-applied-badge">
                          <CheckCircle className="w-4 h-4" style={{ display: "inline", marginRight: "0.25rem" }} />
                          Applied
                        </div>
                      ) : isAdmin ? (
                        <>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/listings/edit/${job._id}`);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteListing(job);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={(e) => {
                            e.stopPropagation();
                            apply(job);
                          }}
                        >
                          ✓ Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showModal && selectedListing && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedListing.title}</h2>
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
                    <p>{selectedListing.title}</p>
                  </div>
                  <div className="detail-item">
                    <label>Company</label>
                    <p>{selectedListing.company}</p>
                  </div>
                  <div className="detail-item">
                    <label>Duration</label>
                    <p>{selectedListing.duration}</p>
                  </div>
                  <div className="detail-item">
                    <label>Description</label>
                    <p>{selectedListing.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {!appliedListings.has(selectedListing.title) && !isAdmin && (
                <button
                  className="btn btn-success"
                  onClick={() => apply(selectedListing)}
                >
                  Apply Now
                </button>
              )}
              {appliedListings.has(selectedListing.title) && (
                <div className="listing-applied-badge" style={{ padding: "0.75rem 1.5rem" }}>
                  ✓ You've already applied
                </div>
              )}
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