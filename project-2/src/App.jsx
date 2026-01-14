import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayouts";
import EditListing from "./pages/EditListings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED APP ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listings/add" element={<ProtectedRoute adminOnly><EditListing /></ProtectedRoute>} />
        <Route path="/listings/edit/:id" element={<ProtectedRoute adminOnly><EditListing /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}