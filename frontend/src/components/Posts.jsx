import { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { DUMMY_POSTS } from "../data";
import Loader from "../components/Loader";
import axios from 'axios'

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`)
        setPosts(response?.data)
      } catch (error) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchPosts()
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map((post) => (
            <PostItem post={post} key={post._id} />
          ))}
        </div>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};
export default Posts;
