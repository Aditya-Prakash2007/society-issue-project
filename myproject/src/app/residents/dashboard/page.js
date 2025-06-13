export default function ResidentDashboard() {
  const complaints = [
    { id: "COMP-001", category: "Plumbing", status: "Submitted" },
    { id: "COMP-002", category: "Electrical", status: "Resolved" }
  ];

  return (
    <div className="container">
      <h1>Resident Dashboard</h1>
      <ul>
        {complaints.map((params) => (
          <li key={params.id}>
            {params.category} - {params.status} ({params.id})
          </li>
        ))}
      </ul>
    </div>
  );
}
