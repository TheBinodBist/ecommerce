import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { api } from "../api";
import useAuth from "../hooks/useAuth";
import "../styles/ui.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/token/", {
        // User login (get access token)
        email: formData.email,
        password: formData.password,
      });

      console.log(response);

      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;

      if (accessToken) {
        //  Store in Local Storage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setAuth({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        navigate("/");
      }
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid credentials";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-auth">
      <Row className="g-0 min-vh-100">
        {/* Brand panel */}
        <Col
          lg={5}
          className="ui-auth-aside d-none d-lg-flex flex-column justify-content-between p-5"
        >
          <div className="ui-eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>
            Members
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              className="display-4 fw-bold mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Good to
              <br />
              see you again.
            </h1>
            <p
              className="fs-5 mb-0"
              style={{ color: "rgba(255,255,255,.65)", maxWidth: 360 }}
            >
              Pick up where you left off — your cart and orders are waiting.
            </p>
          </div>
          <div />
        </Col>

        {/* Form */}
        <Col
          lg={7}
          className="d-flex align-items-center justify-content-center p-4"
        >
          <div className="w-100" style={{ maxWidth: 420 }}>
            <div className="ui-eyebrow mb-2">Sign in</div>
            <h2 className="ui-title display-6 mb-1">Welcome back</h2>
            <p className="ui-muted mb-4">Sign in to your account</p>

            {error && (
              <Alert variant="danger" className="border-0 rounded-4">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="ui-eyebrow">Email</Form.Label>
                <Form.Control
                  type="text"
                  className="ui-input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="ui-eyebrow">Password</Form.Label>
                <Form.Control
                  type="password"
                  className="ui-input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="btn-ink w-100 py-3 mb-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>

            <p className="mb-0 ui-muted text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="fw-bold text-decoration-none"
                style={{ color: "var(--ui-accent-dark)" }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
