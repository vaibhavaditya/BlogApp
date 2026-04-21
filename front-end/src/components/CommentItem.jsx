export default function CommentItem({ comment }) {
  return (
    <div>
      <p>{comment.user?.username}</p>
      <p>{comment.text}</p>
    </div>
  );
}