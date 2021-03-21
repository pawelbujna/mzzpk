import { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alert";
import jwt from "jsonwebtoken";
import PasswordStrengthBar from "react-password-strength-bar";

const Reset = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
    token: "",
    buttonText: "Zresetuj",
    success: "",
    error: "",
    isDisabled: false,
  });

  const {
    newPassword,
    confirmPassword,
    name,
    token,
    buttonText,
    success,
    error,
    isDisabled,
  } = state;

  useEffect(() => {
    const routerId = router.query.id;
    const decoded = jwt.decode(routerId);

    if (decoded) {
      setState({ ...state, name: decoded.name, token: routerId });
    }
  }, [router]);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword != confirmPassword) {
      setState({ ...state, error: "Hasła nie są takie same" });
      return;
    }

    setState({ ...state, buttonText: "Resetuje...", isDisabled: true });

    try {
      const response = await axios.put(`${process.env.API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      setState({
        ...state,
        newPassword: "",
        buttonText: "Zresetuj",
        isDisabled: false,
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Zresetuj",
        isDisabled: false,
        error: error.response.data.error,
      });
    }
  };

  const passwordResetForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange("newPassword")}
            value={newPassword}
            placeholder="Nowe hasło"
            required
          />
          <PasswordStrengthBar
            password={newPassword}
            isRequireed={true}
            scoreWords={["słabe", "słabe", "ok", "dobre", "świetne"]}
            shortScoreWord="za krótkie"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange("confirmPassword")}
            value={confirmPassword}
            placeholder="Powtórz hasło"
            required
          />
        </div>
        <div>
          <button
            isDisabled={isDisabled}
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Cześć {name}! Zresetuj swoje hasło.</h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <br />

          {!!success ? (
            <Link href={"/login"}>
              <a className="btn btn-primary btn-block">
                Przejdź do strony logowania
              </a>
            </Link>
          ) : (
            passwordResetForm()
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Reset);
