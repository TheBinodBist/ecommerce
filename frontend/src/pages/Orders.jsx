import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import OrderDetail from "../components/OrderDetail";
import "../styles/ui.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (orderId) => {
    setSelectedOrder(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const { api } = useAxios();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/"); // Get all orders list
        setOrders(response.data.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (auth.accessToken) fetchOrders();
  }, [api, auth.accessToken]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "#FFF9DB",
          text: "#8C6D05",
          border: "#FFEC99",
          icon: <Clock size={14} />,
          accent: "#FAB005",
        };
      case "CONFIRMED":
        return {
          bg: "#E7F5FF",
          text: "#1864AB",
          border: "#A5D8FF",
          icon: <CheckCircle size={14} />,
          accent: "#228BE6",
        };
      case "DELIVERED":
        return {
          bg: "#EBFBEE",
          text: "#2B8A3E",
          border: "#B2F2BB",
          icon: <Package size={14} />,
          accent: "#40C057",
        };
      default:
        return {
          bg: "#F8F9FA",
          text: "#495057",
          border: "#DEE2E6",
          icon: <AlertCircle size={14} />,
          accent: "#ADB5BD",
        };
    }
  };

  return (
    <Col lg={9} className="py-4 px-md-4">
      <div className="mb-4">
        <div className="ui-eyebrow mb-1">Account</div>
        <h2 className="ui-title mb-1">Purchase History</h2>
        <p className="ui-muted mb-0">
          A detailed list of all your previous orders.
        </p>
      </div>

      <div className="ui-card overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="grow" style={{ color: "var(--ui-accent)" }} />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order, index) => {
            const config = getStatusConfig(order.status);
            return (
              <Row
                key={order.id}
                className="ui-row g-0 align-items-center px-3 px-md-4 py-3 mx-0"
                style={{
                  borderTop: index === 0 ? "none" : "1px solid var(--ui-line)",
                }}
              >
                {/* Icon + id */}
                <Col
                  xs={12}
                  md={4}
                  className="d-flex align-items-center gap-3 mb-2 mb-md-0"
                >
                  <span
                    className="d-inline-grid flex-shrink-0"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: config.bg,
                      color: config.text,
                    }}
                  >
                    {config.icon}
                  </span>
                  <div>
                    <div className="fw-bold">#{order.id}</div>
                    <small className="ui-muted">
                      {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </small>
                  </div>
                </Col>

                {/* Status */}
                <Col xs={6} md={3}>
                  <span
                    className="small fw-bold text-uppercase"
                    style={{ color: config.text, letterSpacing: ".06em" }}
                  >
                    {order.status}
                  </span>
                </Col>

                {/* Amount */}
                <Col xs={6} md={3} className="text-end text-md-start">
                  <div className="fw-bold">${order.grand_total}</div>
                  <small className="ui-muted">Tax ${order.tax_amount}</small>
                </Col>

                {/* Action */}
                <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
                  <Button
                    className="btn-soft px-3"
                    size="sm"
                    onClick={() => handleOpenModal(order?.id)}
                  >
                    <Eye size={14} className="me-1" /> View
                  </Button>
                </Col>
              </Row>
            );
          })
        ) : (
          <div className="text-center py-5">
            <Package size={40} className="ui-muted mb-2 opacity-50" />
            <p className="ui-muted mb-0">No orders found in your account.</p>
          </div>
        )}
      </div>

      <OrderDetail
        orderId={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Col>
  );
};

export default Orders;
