import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`);
        setAuthors(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getAuthors();
  }, []);

  if (isLoading) return <Loader />

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map((author) => {
            return (
              <Link
                to={`/posts/users/${author._id}`}
                key={author.id}
                className="author"
              >
                <div className="author__avatar">
                  <img
                    src={`${import.meta.env.VITE_ASSETS_URL}/uploads/${
                      author.avatar
                    }`}
                    alt={`Image of ${author.name}`}
                  />
                </div>
                <div className="author__info">
                  <h4>{author.name}</h4>
                  <p>{author.posts} posts</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No Authors found.</h2>
      )}
    </section>
  );
}
export default Authors;
