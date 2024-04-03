import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleInput(e) {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );
      const user = await response.data
      setCurrentUser(user)
      navigate('/')
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign In</h2>
        <form onSubmit={login} className="form login__form">
          {error && <p className="form__error-msg">{error}</p>}
          <input
            type="text"
            placeholder="Mail"
            name="email"
            value={userData.email}
            onChange={handleInput}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleInput}
          />
          <input type="submit" value="Login" className="btn primary" />
        </form>
        <small>
          Don't have an account ? <Link to="/register">sign up</Link>
        </small>
      </div>
    </section>
  );
};
export default Login;
