import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import API_URL from "../config";
import "../styles/Pages.css";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState({
    title: "",
    company: "",
    duration: "",
    description: ""
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing listing for EDIT mode
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/listings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listing");
        return res.json();
      })
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load listing");
        setLoading(false);
      });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!listing.title || !listing.company || !listing.duration || !listing.description) {
      alert("❌ Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        // EDIT
        const response = await fetch(`${API_URL}/listings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing)
        });
        
        if (!response.ok) throw new Error("Failed to update listing");
        alert("✅ Listing updated successfully!");
      } else {
        // ADD
        const response = await fetch(`${API_URL}/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing)
        });
        
        if (!response.ok) throw new Error("Failed to create listing");
        alert("✅ Listing created successfully!");
      }
      
      navigate("/listings");
    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading listing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <AlertCircle className="w-12 h-12" style={{ marginBottom: "1rem" }} />
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/listings")}
          style={{ marginTop: "1rem" }}
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h1>📝 {id ? "Edit Listing" : "Create New Listing"}</h1>
          <p className="profile-subtitle">
            {id ? "Update job listing details" : "Add a new job opportunity"}
          </p>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate("/listings")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Form Card */}
      <div className="profile-form-card">
        <form onSubmit={submit}>
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>

            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                value={listing.title}
                onChange={(e) => setListing({ ...listing, title: e.target.value })}
                className="form-input"
                placeholder="e.g., Frontend Developer Intern"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                value={listing.company}
                onChange={(e) => setListing({ ...listing, company: e.target.value })}
                className="form-input"
                placeholder="e.g., Tech Innovations Inc"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration *</label>
              <select
                value={listing.duration}
                onChange={(e) => setListing({ ...listing, duration: e.target.value })}
                className="form-input"
                required
              >
                <option value="">Select duration</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="4 months">4 months</option>
                <option value="5 months">5 months</option>
                <option value="6 months">6 months</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Description</h3>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                value={listing.description}
                onChange={(e) => setListing({ ...listing, description: e.target.value })}
                className="form-input"
                placeholder="Describe the role, responsibilities, and requirements..."
                rows="6"
                required
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : id ? "Update Listing" : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}