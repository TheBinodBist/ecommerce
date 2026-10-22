import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { api } from "../api";
import "../styles/ui.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
    setSuccess("");

    // Frontend validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await api.post("/register/", payload); // Register a new user

      if (response.status === 201) {
        setSuccess("Account created successfully.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        console.log(err);
        const apiError = err.response.data;

        // Handle DRF field errors nicely
        const message = Object.values(apiError).flat().join(" ");

        setError(message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-auth">
      <Row className="g-0 min-vh-100 flex-lg-row-reverse">
        {/* Brand panel (right on desktop) */}
        <Col
          lg={5}
          className="ui-auth-aside d-none d-lg-flex flex-column justify-content-between p-5"
        >
          <div className="ui-eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>
            New here
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              className="display-4 fw-bold mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Start your
              <br />
              first order.
            </h1>
            <p
              className="fs-5 mb-0"
              style={{ color: "rgba(255,255,255,.65)", maxWidth: 360 }}
            >
              Create an account to save your cart and track every purchase.
            </p>
          </div>
          <div />
        </Col>

        {/* Form */}
        <Col
          lg={7}
          className="d-flex align-items-center justify-content-center p-4"
        >
          <div className="w-100" style={{ maxWidth: 480 }}>
            <div className="ui-eyebrow mb-2">Sign up</div>
            <h2 className="ui-title display-6 mb-4">Create Account</h2>

            {error && (
              <Alert variant="danger" className="border-0 rounded-4">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="border-0 rounded-4">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Row className="g-3 mb-4">
                {/* USERNAME */}
                <Col md={6}>
                  <Form.Label className="ui-eyebrow">Username</Form.Label>
                  <Form.Control
                    type="text"
                    className="ui-input"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                </Col>

                {/* EMAIL */}
                <Col md={6}>
                  <Form.Label className="ui-eyebrow">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    className="ui-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Col>

                {/* PASSWORD */}
                <Col md={6}>
                  <Form.Label className="ui-eyebrow">Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="ui-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                  />
                </Col>

                {/* CONFIRM PASSWORD (Frontend Only) */}
                <Col md={6}>
                  <Form.Label className="ui-eyebrow">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    className="ui-input"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </Col>
              </Row>

              <Button
                type="submit"
                className="btn-accent w-100 py-3"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Form>

            <p className="mt-4 mb-0 ui-muted text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="fw-bold text-decoration-none"
                style={{ color: "var(--ui-ink)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
