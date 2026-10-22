import { useEffect, useState } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { ChevronRight, Mail, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import "../styles/ui.css";

const DashboardHome = () => {
  const [profile, setProfile] = useState(null);
  const [ordeers, setOrdeers] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const { api } = useAxios();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsInitialLoading(true);

        const [profileRes, ordersRes] = await Promise.all([
          api.get("/profile/"), // Show username and email in dashboard
          api.get("/orders/"),
        ]);

        setProfile(profileRes.data);
        setOrdeers(ordersRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (accessToken) {
      fetchDashboardData();
    } else {
      setIsInitialLoading(false);
    }
  }, [accessToken, api]);

  const getStatusSettings = (status) => {
    switch (status) {
      case "PENDING":
        return { color: "warning", textClass: "text-dark" };
      case "CONFIRMED":
        return { color: "info", textClass: "text-dark" };
      case "DELIVERED":
        return { color: "success", textClass: "text-success" };
      default:
        return { color: "secondary", textClass: "text-secondary" };
    }
  };

  if (isInitialLoading) {
    return (
      <Col
        lg={9}
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <Spinner
            animation="grow"
            style={{ color: "var(--ui-accent)" }}
            className="mb-2"
          />
          <p className="ui-muted small">Loading your dashboard...</p>
        </div>
      </Col>
    );
  }

  return (
    <Col as="main" lg={9}>
      {/* Hero */}
      <header className="ui-card-dark p-4 p-md-5 mb-4 d-flex align-items-center gap-4">
        <div
          className="ui-avatar"
          style={{ width: 72, height: 72, fontSize: "1.8rem" }}
        >
          {(profile?.username || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="ui-eyebrow mb-1">Dashboard</div>
          <h2 className="fw-bold mb-1">
            Welcome back, {profile?.username || "User"}!
          </h2>
          <p className="ui-muted mb-0">
            Manage your account and track your recent orders.
          </p>
        </div>
      </header>

      {/* Profile tiles */}
      <Row as="section" className="g-3 mb-4">
        <Col sm={6}>
          <div className="ui-card p-4 d-flex align-items-center gap-3 h-100">
            <User size={20} style={{ color: "var(--ui-accent)" }} />
            <div>
              <div className="ui-eyebrow">Username</div>
              <div className="fw-bold">{profile?.username}</div>
            </div>
          </div>
        </Col>
        <Col sm={6}>
          <div className="ui-card p-4 d-flex align-items-center gap-3 h-100">
            <Mail size={20} style={{ color: "var(--ui-accent)" }} />
            <div>
              <div className="ui-eyebrow">Email address</div>
              <div className="fw-bold">{profile?.email}</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Orders */}
      <section className="ui-card overflow-hidden">
        <div className="d-flex justify-content-between align-items-center p-4 pb-3">
          <h5 className="ui-title mb-0">Recent orders</h5>
          <Button size="sm" className="btn-soft px-3">
            View All
          </Button>
        </div>

        {ordeers.length > 0 ? (
          ordeers.slice(0, 4).map((order) => {
            const { color, textClass } = getStatusSettings(order.status);
            return (
              <div
                key={order.id}
                className="ui-row d-flex align-items-center gap-3 px-4 py-3"
                style={{ borderTop: "1px solid var(--ui-line)" }}
              >
                <div className="flex-grow-1">
                  <div className="fw-bold">#{order.id}</div>
                  <small className="ui-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </small>
                </div>

                <div className="d-none d-md-block text-end me-3">
                  <small className="ui-muted d-block">
                    Subtotal ${order.subtotal}
                  </small>
                  <span className="fw-bold">${order.grand_total}</span>
                </div>

                <span
                  className={`d-inline-flex align-items-center gap-2 small fw-semibold ${textClass}`}
                  style={{ minWidth: 110 }}
                >
                  <span
                    className={`d-inline-block rounded-circle bg-${color}`}
                    style={{ width: 8, height: 8 }}
                  />
                  {order.status}
                </span>

                <Button variant="light" className="btn-round">
                  <ChevronRight size={16} />
                </Button>
              </div>
            );
          })
        ) : (
          <div
            className="text-center py-5 ui-muted"
            style={{ borderTop: "1px solid var(--ui-line)" }}
          >
            No orders found.
          </div>
        )}
      </section>
    </Col>
  );
};

export default DashboardHome;
