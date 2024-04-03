import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

function DeletePost({ postId }) {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const location = useLocation();

  // access control
  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  const removePost = async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) navigate(0);
        else navigate("/");
      }
    } catch (error) {
      console.log("Couldn't delete post: " + error);
    }
    setIsLoading(false)
  };

  if (isLoading) return <Loader />

  return (
    <Link onClick={() => removePost(postId)} className="btn sm danger">
      Delete
    </Link>
  );
}
export default DeletePost;
