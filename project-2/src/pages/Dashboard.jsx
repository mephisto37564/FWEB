import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import API_URL from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const isAdmin = role === "admin";

  const [applicationCount, setApplicationCount] = useState(0);
  const [listingCount, setListingCount] = useState(0);
  const [username, setUsername] = useState("");
  const [userApplicationCount, setUserApplicationCount] = useState(0);

  useEffect(() => {
    // Fetch listings count
    fetch(`${API_URL}/listings`)
      .then(res => res.json())
      .then(data => setListingCount(data.length))
      .catch(console.error);

    // Fetch logged-in user
    if (userId) {
      fetch(`${API_URL}/users/${userId}`)
        .then(res => res.json())
        .then(user => setUsername(user.name))
        .catch(console.error);
    }

    if (isAdmin) {
      // For admin: fetch total applications
      fetch(`${API_URL}/applications`)
        .then(res => res.json())
        .then(data => setApplicationCount(data.length))
        .catch(console.error);
    } else {
      // For user: fetch user's own applications
      fetch(`${API_URL}/applications`)
        .then(res => res.json())
        .then(data => {
          const userApps = data.filter(app => app.userId === userId || app.userId?._id === userId);
          setUserApplicationCount(userApps.length);
        })
        .catch(console.error);
    }
  }, [userId, isAdmin]);

  // Route to new comprehensive dashboards
  if (isAdmin) {
    return (
      <PageWrapper>
        <AdminDashboard />
      </PageWrapper>
    );
  }

  // User Dashboard
  return (
    <PageWrapper>
      <UserDashboard />
    </PageWrapper>
  );
};

export default Dashboard;