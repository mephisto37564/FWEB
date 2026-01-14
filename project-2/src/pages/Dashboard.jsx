// import { Card, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router";
// import { useEffect, useState } from "react";
// import PageWrapper from "../components/PageWrapper";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [applicationCount, setApplicationCount] = useState(0);
//   const [listingCount, setListingCount] = useState(0);
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     // Fetch applications count
//     fetch("http://localhost:3000/applications")
//       .then(res => res.json())
//       .then(data => setApplicationCount(data.length))
//       .catch(console.error);

//     // Fetch listings count
//     fetch("http://localhost:3000/listings")
//       .then(res => res.json())
//       .then(data => setListingCount(data.length))
//       .catch(console.error);

//     // Fetch logged-in user
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       fetch(`http://localhost:3000/users/${userId}`)
//         .then(res => res.json())
//         .then(user => setUsername(user.name))
//         .catch(console.error);
//     }
//   }, []);

//   return (
//     <PageWrapper>
//       <h2>Welcome back{username ? `, ${username}` : ""}!</h2>
//       <p className="text-muted">Here's your quick overview:</p>

//       <Row className="mt-4 g-4">
//         {/* Listings */}
//         <Col lg={4} md={6}>
//           <Card
//             className="h-100"
//             onClick={() => navigate("/listings")}
//             style={{ cursor: "pointer" }}
//           >
//             <Card.Body>
//               <Card.Title>
//                 {listingCount} Available Listings
//               </Card.Title>
//               <Card.Text>
//                 Fresh opportunities waiting for you.
//               </Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Active Applications */}
//         <Col lg={4} md={6}>
//           <Card
//             className="h-100"
//             onClick={() => navigate("/applications")}
//             style={{ cursor: "pointer" }}
//           >
//             <Card.Body>
//               <Card.Title>
//                 {applicationCount} Active Applications
//               </Card.Title>
//               <Card.Text>
//                 Your ongoing internship submissions.
//               </Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </PageWrapper>
//   );
// };

// export default Dashboard;

import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

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
    fetch("http://localhost:3000/listings")
      .then(res => res.json())
      .then(data => setListingCount(data.length))
      .catch(console.error);

    // Fetch logged-in user
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then(res => res.json())
        .then(user => setUsername(user.name))
        .catch(console.error);
    }

    if (isAdmin) {
      // For admin: fetch total applications
      fetch("http://localhost:3000/applications")
        .then(res => res.json())
        .then(data => setApplicationCount(data.length))
        .catch(console.error);
    } else {
      // For user: fetch user's own applications
      fetch("http://localhost:3000/applications")
        .then(res => res.json())
        .then(data => {
          const userApps = data.filter(app => app.userId === userId || app.userId?._id === userId);
          setUserApplicationCount(userApps.length);
        })
        .catch(console.error);
    }
  }, [userId, isAdmin]);

  // Admin Dashboard
  if (isAdmin) {
    return (
      <PageWrapper>
        <h2>Welcome back{username ? `, ${username}` : ""}!</h2>
        <p className="text-muted">Admin Dashboard - Here's your overview:</p>

        <Row className="mt-4 g-4">
          {/* Total Listings */}
          <Col lg={4} md={6}>
            <Card
              className="h-100"
              onClick={() => navigate("/listings")}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>
                  {listingCount} Job Listings
                </Card.Title>
                <Card.Text>
                  Posted internship opportunities.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Total Applications */}
          <Col lg={4} md={6}>
            <Card
              className="h-100"
              style={{ cursor: "default" }}
            >
              <Card.Body>
                <Card.Title>
                  {applicationCount} Applications
                </Card.Title>
                <Card.Text>
                  Total student submissions received.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Add New Listing */}
          <Col lg={4} md={6}>
            <Card
              className="h-100"
              onClick={() => navigate("/listings/add")}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>
                  Create New Listing
                </Card.Title>
                <Card.Text>
                  Post a new internship opportunity.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </PageWrapper>
    );
  }

  // User Dashboard
  return (
    <PageWrapper>
      <h2>Welcome back{username ? `, ${username}` : ""}!</h2>
      <p className="text-muted">Here's your quick overview:</p>

      <Row className="mt-4 g-4">
        {/* Listings */}
        <Col lg={4} md={6}>
          <Card
            className="h-100"
            onClick={() => navigate("/listings")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>
                {listingCount} Available Listings
              </Card.Title>
              <Card.Text>
                Fresh opportunities waiting for you.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Active Applications */}
        <Col lg={4} md={6}>
          <Card
            className="h-100"
            onClick={() => navigate("/applications")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>
                {userApplicationCount} Active Applications
              </Card.Title>
              <Card.Text>
                Your ongoing internship submissions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default Dashboard;