// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// import { Link, useNavigate } from "react-router";

// const MyNavbar = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <Navbar bg="light" expand="lg" fixed="top">
//       <Container>
//         <Navbar.Brand as={Link} to="/dashboard">
//           J*bify
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="nav" />

//         <Navbar.Collapse id="nav">
//           <Nav className="ms-auto">
//             <Nav.Link as={Link} to="/dashboard">
//               Dashboard
//             </Nav.Link>

//             <Nav.Link as={Link} to="/listings">
//               Listings
//             </Nav.Link>

//             <Nav.Link as={Link} to="/applications">
//               Applications
//             </Nav.Link>

//             <NavDropdown title="Account" align="end">
//               <NavDropdown.Item as={Link} to="/profile">
//                 Profile
//               </NavDropdown.Item>

//               <NavDropdown.Divider />

//               <NavDropdown.Item onClick={logout}>
//                 Logout
//               </NavDropdown.Item>
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default MyNavbar;

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

const MyNavbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          J*bify
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav" />

        <Navbar.Collapse id="nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/listings">
              Listings
            </Nav.Link>

            {!isAdmin && (
              <Nav.Link as={Link} to="/applications">
                Applications
              </Nav.Link>
            )}

            <NavDropdown title="Account" align="end">
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item onClick={logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;