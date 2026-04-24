import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import AddComment from "../components/AddComment";

function PostDetails() {
  const { id } = useParams(); // postId

  return (
    <div>
      <h2>Comments</h2>

      {/* Add Comment */}
      <AddComment postId={id} />

      {/* Show Comments */}
      <CommentSection postId={id} />
    </div>
  );
}

export default PostDetails;