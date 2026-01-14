import { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import API_URL from "../config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const save = async () => {
    await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    alert("Profile updated");
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="container-xl mt-4">
      <h2>Your Profile</h2>

      <Card className="mt-4">
        <Card.Body>
          <Row className="g-4">
            <Col md={4}>
              <img
                src="https://via.placeholder.com/150"
                className="img-fluid rounded"
                alt="Profile"
              />
            </Col>

            <Col md={8}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    value={user.name || ""}
                    onChange={e =>
                      setUser({ ...user, name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={user.email || ""}
                    onChange={e =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Resume</Form.Label>

                  <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      setUser({
                        ...user,
                        resume: file.name
                      });
                    }}
                  />

                  {user.resume && (
                    <Form.Text className="text-muted">
                      Uploaded: {user.resume}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button onClick={save}>Save Changes</Button>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;