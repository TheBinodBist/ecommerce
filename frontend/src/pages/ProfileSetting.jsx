import { Save, User } from "lucide-react";
import { useState } from "react";
import { Row, Col, Nav, Form, Button, Alert, Spinner } from "react-bootstrap";
import "../styles/ui.css";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const user = "";
  const isLoading = false;
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [alerts, setAlerts] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = " ";
      if (success) {
        setAlerts({
          type: "success",
          message: "Profile updated successfully!",
        });
        setTimeout(() => setAlerts(null), 3000);
      }
    } catch (error) {
      setAlerts({
        type: "danger",
        message: "Failed to update profile",
      });
    }
  };

  return (
    <Col lg={9} className="mt-4">
      <Row className="justify-content-center">
        <Col xl={9}>
          {/* Header with avatar */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="ui-avatar">
              {(profileData.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="ui-eyebrow">Settings</div>
              <h2 className="ui-title mb-0">Profile Settings</h2>
              <small className="ui-muted">
                Manage your account information
              </small>
            </div>
          </div>

          {/* Alerts */}
          {alerts && (
            <Alert
              variant={alerts.type}
              dismissible
              onClose={() => setAlerts(null)}
              className="border-0 rounded-4"
            >
              {alerts.message}
            </Alert>
          )}

          {/* Tabs as pills */}
          <Nav variant="pills" className="mb-3 gap-2">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                className="rounded-pill px-4 fw-semibold"
                style={
                  activeTab === "profile"
                    ? { background: "var(--ui-ink)", color: "#fff" }
                    : { color: "var(--ui-ink)" }
                }
              >
                <User size={16} className="me-2" />
                Profile Information
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="ui-card p-4 p-md-5">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h5 className="ui-title mb-4">Personal Information</h5>
                <Form onSubmit={handleProfileSubmit}>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group controlId="name">
                        <Form.Label className="ui-eyebrow">
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="ui-input"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label className="ui-eyebrow">
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          className="ui-input"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="phone">
                        <Form.Label className="ui-eyebrow">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          className="ui-input"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="ui-dashed my-4" />

                  <div className="text-end">
                    <Button
                      type="submit"
                      className="btn-accent px-4"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="me-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default ProfileSettings;
