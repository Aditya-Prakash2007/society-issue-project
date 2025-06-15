import Link from "next/link";

export default function Navbar() {
  // Style for links to have spacing and no underline by default
  const linkStyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "black",
    fontWeight: "500",
  };

  // Container style for navbar background and padding
  const navStyle = {
    backgroundColor: "#ddd",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
      <nav style={navStyle}>
        <Link href="/login" style={linkStyle}>
          Login
        </Link>
        <span>|</span>
        <Link href="/residents/complaints/new" style={linkStyle}>
          Complaints Section
        </Link>
        <span>|</span>
        <Link href="/residents/dashboard" style={linkStyle}>
          Resident's Dashboard
        </Link>
        <span>|</span>
        <Link href="/manager/dashboard" style={linkStyle}>
          Manager Dashboard
        </Link>
        <span>|</span>
        <Link href="/worker/dashboard" style={linkStyle}>
          Worker Dashboard
        </Link>
        <span>|</span>
        <Link href="/register" style={linkStyle}>
          Register
        </Link>
      </nav>

      <div>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          Welcome to the Residential Society Complaint Management System!
        </h1>
      </div>
    </>
  );
}
