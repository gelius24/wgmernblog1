import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="error-page">
      <div className="center">
        <h2>Page Not Found <br /> <small>Error 404</small></h2>
        <Link to="/" className="btn primary">Return Home</Link>
      </div>
    </section>
  );
};
export default ErrorPage;
