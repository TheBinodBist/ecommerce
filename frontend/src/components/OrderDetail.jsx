import { Hash, Calendar, MapPin, Phone } from "lucide-react";
import { Modal, Badge, Row, Col } from "react-bootstrap";
import { useAxios } from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import "../styles/ui.css";

const OrderDetail = ({ orderId, isOpen, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const { api } = useAxios();
  const { auth } = useAuth();

  useEffect(() => {
    if (!orderId) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (auth.accessToken) fetchOrders();
  }, [api, auth.accessToken, orderId]);

  if (!order) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      contentClassName="border-0 overflow-hidden"
      style={{ "--bs-modal-border-radius": "24px" }}
    >
      {/* Ink header with order number */}
      <Modal.Header
        closeButton
        closeVariant="white"
        className="ui-card-dark rounded-0 border-0 p-4 align-items-start"
      >
        <div>
          <div className="ui-eyebrow mb-1">Order</div>
          <h4 className="fw-bold mb-2 d-flex align-items-center gap-1">
            <Hash size={20} />
            {order?.id}
          </h4>
          <div className="small d-flex align-items-center gap-2 ui-muted">
            <Calendar size={14} />
            {new Date(order?.created_at).toLocaleDateString("en-GB")}
          </div>
        </div>
        <Badge pill className="ms-auto me-3 px-3 py-2 bg-light text-dark">
          {order?.status}
        </Badge>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-3">
          <Col xs={12}>
            <div className="ui-eyebrow mb-2">Payment</div>
            <div className="ui-tile">
              <div className="d-flex justify-content-between mb-2">
                <span className="ui-muted">Tax amount</span>
                <span>${order?.tax_amount}</span>
              </div>
              <div className="ui-dashed my-2" />
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-semibold">Grand total</span>
                <span className="fs-4 fw-bold">${order?.grand_total}</span>
              </div>
            </div>
          </Col>

          <Col xs={12}>
            <div className="ui-eyebrow mb-2">Delivery</div>
            <div className="ui-tile">
              <div className="d-flex gap-2 mb-2">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>
                  {order?.address}, {order?.city}, {order?.state},{" "}
                  {order?.zip_code}
                </span>
              </div>
              <div className="d-flex gap-2 align-items-center ui-muted">
                <Phone size={16} className="flex-shrink-0" />
                <span>{order?.phone_number}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetail;
