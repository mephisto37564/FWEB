import { useEffect, useState } from "react";
import { User, Mail, FileText, Save, Upload, LogOut } from "lucide-react";
import API_URL from "../config";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setPreviewResume(data.resume);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert("❌ Please upload a valid resume file (PDF, DOC, DOCX)");
      return;
    }

    setResumeFile(file);
    setPreviewResume(file.name);
  };

  const save = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (previewResume) {
        formData.append('resume', previewResume);
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setResumeFile(null);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error updating profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h1>Your Profile</h1>
          <p className="profile-subtitle">Manage your account information and resume</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Avatar Card */}
        <div className="profile-avatar-card">
          <div className="avatar-container">
            <div className="avatar">
              <User className="w-12 h-12" />
            </div>
            <div className="avatar-info">
              <h2>{user.name || "User"}</h2>
              <p>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="profile-form-card">
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>

            {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={user.name || ""}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={user.email || ""}
                onChange={e => setUser({ ...user, email: e.target.value })}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Resume Section */}
          <div className="form-section">
            <h3 className="section-title">Resume</h3>

            <div className="resume-upload">
              <div className="upload-area">
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="resume-input" className="upload-label">
                  <Upload className="w-8 h-8" />
                  <span className="upload-text">
                    Drag and drop your resume or click to browse
                  </span>
                  <span className="upload-hint">PDF, DOC, or DOCX (Max 5MB)</span>
                </label>
              </div>

              {previewResume && (
                <div className="resume-preview">
                  <FileText className="w-5 h-5" />
                  <div className="resume-info">
                    <p className="resume-name">{previewResume}</p>
                    <p className="resume-type">Document ready to upload</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      setPreviewResume(null);
                    }}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={save}
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;