import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ListingForm from "../components/ListingForm";

export default function EditListing() {
  const { id } = useParams(); // undefined for ADD
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);

  // EDIT MODE → fetch existing listing
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/listings/${id}`)
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

  const submit = async (data) => {
    try {
      if (id) {
        // EDIT
        const response = await fetch(`http://localhost:3000/listings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error("Failed to update listing");
        alert("Listing updated successfully!");
      } else {
        // ADD
        const response = await fetch("http://localhost:3000/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error("Failed to create listing");
        alert("Listing created successfully!");
      }
      
      navigate("/listings");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <h2>{id ? "Edit Listing" : "Add Listing"}</h2>
      <ListingForm
        initialData={listing}
        onSubmit={submit}
      />
    </>
  );
}