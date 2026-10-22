import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import "../styles/ui.css";

const Checkout = () => {
  const { state: cartState, dispatch } = useCart();
  const navigate = useNavigate();
  const { api } = useAxios();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [profile, setProfile] = useState(null);
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (accessToken) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [accessToken, api]);

  // Redirect if cart is empty
  if (cartState.items.length === 0) {
    return (
      <Container className="py-5">
        <div
          className="ui-card text-center mx-auto p-5"
          style={{ maxWidth: 520 }}
        >
          <h4 className="ui-title">Your cart is empty</h4>
          <p className="ui-muted">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button className="btn-accent px-4" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  const validateShippingForm = () => {
    const newErrors = {};

    if (!shippingAddress.phone.trim()) newErrors.phone = "Phone is required";
    if (!shippingAddress.address.trim())
      newErrors.address = "Address is required";
    if (!shippingAddress.city.trim()) newErrors.city = "City is required";
    if (!shippingAddress.state.trim()) newErrors.state = "State is required";
    if (!shippingAddress.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShippingForm()) setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await api.post("/orders/place/", {
        shippingAddress: shippingAddress,
      });

      if (response.status === 201 || response.status === 200) {
        navigate(`/order/success/${response.data.id || ""}`);
        dispatch({
          type: "SET_CART",
          payload: {
            items: [],
            subtotal: 0,
            total: 0,
            itemCount: 0,
          },
        });
      }
    } catch (error) {
      console.error("Order error:", error);
      const errorMsg =
        error.response?.data?.message || "Order placement failed";
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <div className="ui-eyebrow mb-1">Almost there</div>
        <h1 className="ui-title display-6 mb-4">Checkout</h1>

        {/* Stepper */}
        <div
          className="d-flex align-items-center gap-3"
          style={{ maxWidth: 460 }}
        >
          <div className={`ui-step ${currentStep >= 1 ? "active" : ""}`}>
            <span className="ui-step-dot">1</span>
            <span>Shipping</span>
          </div>
          <div className={`ui-step-line ${currentStep >= 2 ? "active" : ""}`} />
          <div className={`ui-step ${currentStep >= 2 ? "active" : ""}`}>
            <span className="ui-step-dot">2</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={7} xl={8}>
          {/* STEP 1: SHIPPING FORM */}
          {currentStep === 1 && (
            <div className="ui-card p-4 p-md-5">
              <h4 className="ui-title mb-1">Where should we send it?</h4>
              <p className="ui-muted mb-4">Shipping information</p>

              <Form onSubmit={handleShippingSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="ui-eyebrow">Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="ui-input"
                      value={profile?.email}
                      disabled
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="ui-eyebrow">Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      className="ui-input"
                      isInvalid={!!errors.phone}
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Col>

                  <Col xs={12}>
                    <Form.Label className="ui-eyebrow">Address</Form.Label>
                    <Form.Control
                      type="text"
                      className="ui-input"
                      isInvalid={!!errors.address}
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          address: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={5}>
                    <Form.Label className="ui-eyebrow">City</Form.Label>
                    <Form.Control
                      type="text"
                      className="ui-input"
                      isInvalid={!!errors.city}
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={6} md={4}>
                    <Form.Label className="ui-eyebrow">State</Form.Label>
                    <Form.Control
                      type="text"
                      className="ui-input"
                      isInvalid={!!errors.state}
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.state}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={6} md={3}>
                    <Form.Label className="ui-eyebrow">ZIP</Form.Label>
                    <Form.Control
                      type="text"
                      className="ui-input"
                      isInvalid={!!errors.zipCode}
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          zipCode: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zipCode}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <div className="ui-dashed my-4" />

                <div className="d-flex justify-content-between">
                  <Button
                    type="button"
                    className="btn-soft px-4"
                    onClick={() => navigate("/cart")}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Cart
                  </Button>
                  <Button type="submit" className="btn-ink px-4">
                    Continue to Payment{" "}
                    <ArrowRight size={16} className="ms-2" />
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {/* STEP 2: PAYMENT / REVIEW */}
          {currentStep === 2 && (
            <div className="ui-card p-4 p-md-5">
              <h4 className="ui-title mb-1">How would you like to pay?</h4>
              <p className="ui-muted mb-4">Payment method</p>

              <div
                className="d-flex align-items-center gap-3 p-3 mb-3"
                style={{
                  border: "2px solid var(--ui-ink)",
                  borderRadius: 16,
                }}
              >
                <Banknote size={26} />
                <div>
                  <div className="fw-bold">
                    Cash on Delivery / Bank Transfer
                  </div>
                  <div className="ui-muted small">
                    For this demo, we are using "Cash on Delivery" or "Secure
                    Bank Transfer".
                  </div>
                </div>
              </div>

              <div className="ui-tile mb-4">
                <div className="ui-eyebrow mb-2">
                  <MapPin size={12} className="me-1" />
                  Shipping to
                </div>
                <div>
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.state} {shippingAddress.zipCode}
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <Button
                  type="button"
                  className="btn-soft px-4"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft size={16} className="me-2" />
                  Shipping
                </Button>
                <Button
                  type="button"
                  className="btn-accent px-4"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          )}
        </Col>

        {/* Summary */}
        <Col lg={5} xl={4}>
          <div className="ui-card-dark p-4 sticky-top" style={{ top: "100px" }}>
            <div className="ui-eyebrow mb-3">In your order</div>

            {cartState?.items?.map((item) => (
              <div
                key={item?.id}
                className="d-flex justify-content-between align-items-start mb-3"
              >
                <div>
                  <div className="fw-semibold">{item?.product_name}</div>
                  <small className="ui-muted">Qty {item?.quantity}</small>
                </div>
                <span className="fw-semibold">
                  ${item?.price * item?.quantity}
                </span>
              </div>
            ))}

            <div className="ui-divider-dark my-3" />

            <div className="d-flex justify-content-between mb-2">
              <span className="ui-muted">Subtotal</span>
              <span>${cartState?.subtotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="ui-muted">Shipping</span>
              <span>Free</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="ui-muted">Tax</span>
              <span>${cartState?.total - cartState?.subtotal}</span>
            </div>

            <div className="ui-divider-dark my-3" />

            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <span className="fw-semibold">Total</span>
              <span className="fs-3 fw-bold">${cartState?.total}</span>
            </div>

            <div className="text-center small ui-muted">
              <ShieldCheck size={14} className="me-1" />
              Secure checkout with SSL encryption
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
