import { useState, useEffect } from "react";
import { addComment } from "../api/commentApi";
import { getMe } from "../api/userApi";

function AddComment({ postId }) {
const [user, setUser] = useState(null);
const [text, setText] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
const fetchUser = async () => {
try {
const res = await getMe();
setUser(res.data.data);
} catch (error) {
console.error("Failed to fetch user:", error);
}
};

```
fetchUser();
```

}, []);

const handleAdd = async () => {
if (!user) {
alert("Please login first");
return;
}

```
if (!text.trim()) return;

try {
  setLoading(true);

  await addComment(postId, {
    text,
  });

  setText("");
} catch (error) {
  console.error("Add comment error:", error);
} finally {
  setLoading(false);
}
```

};

return ( <div>
<input
type="text"
value={text}
onChange={(e) => setText(e.target.value)}
placeholder="Write a comment..."
/>

```
  <button onClick={handleAdd} disabled={loading}>
    {loading ? "Posting..." : "Post"}
  </button>
</div>

);
}

export default AddComment;
