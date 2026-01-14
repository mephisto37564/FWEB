import { Table, Badge } from "react-bootstrap";

const SentApplications = ({ applications }) => {
  return (
    <div className="mt-4">
      <h4>Submitted Applications</h4>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Internship</th>
            <th>Company</th>
            <th>Status</th>
            <th>Date Applied</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app, index) => (
            <tr key={index}>
              <td>{app.title}</td>
              <td>{app.company}</td>
              <td>
                <Badge bg={app.statusColor}>{app.status}</Badge>
              </td>
              <td>{app.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SentApplications;