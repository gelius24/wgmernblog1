import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({ post }) => {
  const title = post.title.length > 30 ? post.title.substr(0, 30) + "..." : post.title;
  const description = post.description.length > 145 ? post.description.substr(0, 145) + "..." : post.description;

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img src={`${import.meta.env.VITE_ASSETS_URL}/uploads/${post.thumbnail}`} alt={title} />
      </div>
      <div className="post__content">
        <Link to={`/posts/${post._id}`}>
          <h3>{title}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html: description}} />
        <div className="post__footer">
          <PostAuthor authorId={post.creator} createdAt={post.createdAt} />
          <Link className="btn category" to={`posts/categories/${post.category}`}>{post.category}</Link>
        </div>
      </div> 
    </article>
  );
};
export default PostItem;
