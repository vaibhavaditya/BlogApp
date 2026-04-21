import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";

function PostDetails() {
  const { id } = useParams(); // this is postId

  return (
    <div>
      <h2>Comments</h2>

      <CommentSection postId={id} />
    </div>
  );
}

export default PostDetails;