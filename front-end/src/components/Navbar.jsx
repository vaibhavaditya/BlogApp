import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/create">Create</Link>
          <Link to="/profile/me">My Profile</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}