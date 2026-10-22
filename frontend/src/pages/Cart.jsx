import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ShoppingBag, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import { useAxios } from "../hooks/useAxios";
import "../styles/ui.css";

const Cart = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const { api } = useAxios();

  const fetchCartData = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const response = await api.get("/cart/");
      console.log("cart response", response.data);
      dispatch({
        type: "SET_CART",
        payload: {
          items: response.data.items,
          subtotal: response.data.subtotal || 0,
          total: parseFloat(response.data.grand_total) || 0,
          itemCount: response?.data?.items?.length || 0,
        },
      });
    } catch (err) {
      console.error("Fetch error", err);
      dispatch({ type: "STOP_LOADING" });
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleQuantityChange = async (itemId, currentQty, newQty) => {
    const change = newQty - currentQty;
    if (change === 0) return;

    try {
      await api.patch(`/cart/items/${itemId}/`, { change });

      fetchCartData();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleRemoveItem = async (itemId, itemName) => {
    if (window.confirm(`Remove ${itemName} from cart?`)) {
      try {
        await api.delete(`/cart/items/${itemId}/`);
        fetchCartData();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  // Empty State UI
  if (!state.loading && state?.items?.length === 0) {
    return (
      <Container className="py-5" style={{ minHeight: "80vh" }}>
        <div
          className="ui-card text-center mx-auto p-5"
          style={{ maxWidth: 520 }}
        >
          <div
            className="mx-auto mb-4 d-grid"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "var(--ui-accent-soft)",
              placeItems: "center",
              color: "var(--ui-accent)",
            }}
          >
            <ShoppingBag size={38} />
          </div>
          <h3 className="ui-title">Nothing here yet</h3>
          <p className="ui-muted mb-4">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button as={Link} to="/" className="btn-accent px-4 py-2">
            Start Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="mb-4">
        <div className="ui-eyebrow mb-1">Your bag</div>
        <h1 className="ui-title display-6 mb-0">
          Shopping Cart{" "}
          <span className="ui-muted fs-5 fw-normal">({state?.itemCount})</span>
        </h1>
      </div>

      <Row className="g-4">
        {/* Items List */}
        <Col lg={8}>
          {state?.items?.map((item) => (
            <div key={item?.id} className="ui-card p-3 p-md-4 mb-3">
              <Row className="align-items-center g-3">
                <Col md={5}>
                  <div className="fw-bold fs-6">{item?.product_name}</div>
                  <div className="ui-muted small mt-1">
                    ${parseFloat(item?.price)} each{" "}
                    <span className="ui-chip ms-1">
                      {item.tax_percent}% tax
                    </span>
                  </div>
                </Col>

                <Col xs={7} md={3}>
                  <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(newQty) =>
                      handleQuantityChange(item.id, item.quantity, newQty)
                    }
                    min={0}
                    max={item?.stock || 99}
                    size="sm"
                  />
                </Col>

                <Col xs={3} md={2} className="text-md-end">
                  <div className="ui-eyebrow">Subtotal</div>
                  <div className="fw-bold">
                    ${parseFloat(item?.price) * item?.quantity}
                  </div>
                </Col>

                <Col xs={2} md={2} className="text-end">
                  <Button
                    variant="light"
                    className="btn-round text-danger"
                    onClick={() =>
                      handleRemoveItem(item?.id, item?.product_name)
                    }
                    aria-label={`Remove ${item?.product_name}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </Col>
              </Row>
            </div>
          ))}

          <Button
            as={Link}
            to="/"
            variant="link"
            className="text-decoration-none px-0 fw-semibold"
            style={{ color: "var(--ui-ink)" }}
          >
            <ArrowLeft size={16} className="me-2" />
            Continue Shopping
          </Button>
        </Col>

        {/* Summary */}
        <Col lg={4}>
          <div className="ui-card-dark p-4 sticky-top" style={{ top: "100px" }}>
            <div className="ui-eyebrow mb-3">Order summary</div>

            <div className="d-flex justify-content-between mb-2">
              <span className="ui-muted">Subtotal</span>
              <span>${state?.subtotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="ui-muted">Tax</span>
              <span>${state?.total - state?.subtotal}</span>
            </div>

            <div className="ui-divider-dark my-3" />

            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="fw-semibold">Total</span>
              <span className="fs-3 fw-bold">${state?.total}</span>
            </div>

            <Button
              className="btn-accent w-100 py-3 mb-3"
              size="lg"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>

            <div className="text-center small ui-muted">
              <ShieldCheck size={14} className="me-1" />
              Secure Checkout
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
