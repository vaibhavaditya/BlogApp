import { Link, useNavigate } from "react-router-dom";
import { getMe, logoutUser, searchUsers } from "../api/userApi.js";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  // 🔍 search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const navigate = useNavigate();

  // ✅ fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        console.log("GET ME:", res.data);

        // ⚠️ adjust based on your backend structure
        setUser(res.data?.data?.user || res.data?.user || null);
      } catch (err) {
        console.error("GET ME FAILED:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // 🔍 debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoadingSearch(true);

        const res = await searchUsers(query);

        // ⚠️ adjust if needed
        console.log(res.data?.data);
        
        setResults(res.data?.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // ✅ logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  // 🔍 click search result
  const handleUserClick = (id) => {
    setQuery("");
    setResults([]);
    navigate(`/profile/${id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        background: "#fafafa",
      }}
    >
      {/* LEFT */}
      <Link to="/">Home</Link>

      {/* 🔍 SEARCH */}
      <div style={{ marginLeft: 20, position: "relative", width: "220px" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "6px", width: "100%" }}
        />

        {/* DROPDOWN */}
        {(results.length > 0 || loadingSearch) && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%", // ✅ FIXED (no overflow)
              background: "#fff",
              border: "1px solid #ccc",
              zIndex: 1000,
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            {loadingSearch ? (
              <div style={{ padding: 8 }}>Searching...</div>
            ) : results.length === 0 ? (
              <div style={{ padding: 8 }}>No users found</div>
            ) : (
              results.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u._id)}
                  style={{
                    padding: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt="avatar"
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%" }}
                  />
                  <div>
                    <div>{u.username}</div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      {u.fullName}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDE (pushed to end) */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
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
    </div>
  );
}