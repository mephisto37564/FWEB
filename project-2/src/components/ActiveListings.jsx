import { Table, Button } from "react-bootstrap";

const ActiveListings = ({ jobs }) => {
  // CHANGED: Added empty-state handling for better UX
  if (!jobs || jobs.length === 0) {
    return <p className="mt-4 text-muted">No active listings available.</p>;
  }

  return (
    <div className="mt-4">
      <h4>Active Job Listings</h4>

      <Table striped bordered hover responsive className="mt-3">
        {/* CHANGED: Replaced cards with a table layout */}
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              {/* CHANGED: Use job.id instead of array index (best practice) */}
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.duration}</td>
              <td>{job.description}</td>
              <td>
                <Button size="sm" variant="primary">
                  Apply
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ActiveListings;