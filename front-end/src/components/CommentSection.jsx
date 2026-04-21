import { useEffect, useState } from "react";
import { getCommentsByPost, addComment } from "../api/commentApi";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const res = await getCommentsByPost(postId);
    setComments(res.data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAdd = async () => {
    await addComment(postId, { text });
    setText("");
    fetchComments();
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} />
      ))}
    </div>
  );
}