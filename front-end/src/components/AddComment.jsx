import { useState } from "react";
import { addComment } from "../api/commentApi";
import useAuth from "../hooks/useAuth";

function AddComment({ postId }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (!text.trim()) return;

    try {
      setLoading(true);

      await addComment(postId, { text });

      setText(""); // clear input
    } catch (err) {
      console.error("Add comment error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment"
      />

      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}

export default AddComment;