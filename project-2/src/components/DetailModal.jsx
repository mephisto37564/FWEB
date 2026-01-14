import { Modal, Button, Row, Col } from "react-bootstrap";

export default function DetailModal({ show, data, onHide, onApply, onUnapply, isAdmin, type }) {
  if (!data) return null;

  const isListing = type === "listing";

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <h6 className="text-muted">Company</h6>
            <p className="fs-5">{data.company}</p>
          </Col>
          <Col md={6}>
            <h6 className="text-muted">Duration</h6>
            <p className="fs-5">{data.duration}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h6 className="text-muted">Description</h6>
            <p>{data.description || "No description provided"}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h6 className="text-muted">{isListing ? "Posted Date" : "Applied Date"}</h6>
            <p>{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {isListing && !isAdmin && (
          <Button variant="primary" onClick={() => {
            onApply(data);
            onHide();
          }}>
            Apply Now
          </Button>
        )}
        {!isListing && (
          <Button variant="danger" onClick={() => {
            onUnapply(data);
            onHide();
          }}>
            Unapply
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}