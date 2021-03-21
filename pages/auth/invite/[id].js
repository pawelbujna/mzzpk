import { useState, useEffect } from "react";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import Layout from "../../../components/Layout";
import axios from "axios";

import PasswordStrengthBar from "react-password-strength-bar";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";

const Register = ({ router }) => {
  const [state, setState] = useState({
    usersEmail: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
    error: "",
    success: "",
    buttonText: "Zapisz",
    isDisabled: false,
  });

  useEffect(() => {
    let token = router.query.id;

    if (token) {
      const { email } = jwt.decode(token);

      setState({ ...state, usersEmail: email, email, token });
    }
  }, [router]);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Zapisz",
    });
  };

  const {
    name,
    email,
    token,
    usersEmail,
    password,
    confirmPassword,
    error,
    success,
    buttonText,
    isDisabled,
  } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setState({ ...state, error: "Hasła nie są takie same" });
      return;
    }

    setState({ ...state, buttonText: "Zapisuje...", isDisabled: true });

    try {
      const response = await axios.post(`${process.env.API}/register`, {
        name,
        email,
        password,
        token,
      });

      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        buttonText: "Zapisz",
        isDisabled: false,
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Zapisz",
        isDisabled: false,
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            type="text"
            className="form-control"
            placeholder="Imie"
            onChange={handleChange("name")}
            required
          />
        </div>

        <div className="form-group">
          <input
            value={email}
            type="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange("email")}
            required
          />
        </div>

        <div className="form-group">
          <input
            value={password}
            type="password"
            className="form-control"
            placeholder="Hasło"
            onChange={handleChange("password")}
            required
          />
          <PasswordStrengthBar
            password={password}
            isRequireed={true}
            scoreWords={["słabe", "słabe", "ok", "dobre", "świetne"]}
            shortScoreWord="za krótkie"
          />
        </div>

        <div className="form-group">
          <input
            value={confirmPassword}
            type="password"
            className="form-control"
            placeholder="Powtórz hasło"
            onChange={handleChange("confirmPassword")}
            required
          />
        </div>

        <div className="form-group">
          <button
            disabled={isDisabled}
            className="btn btn-outline-warning"
            type="submit"
          >
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Cześć {usersEmail}. Stwórz swoje konto.</h1>

        <br />

        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}

        {registerForm()}
      </div>
    </Layout>
  );
};

export default withRouter(Register);
