import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Image, Button, Spinner } from "react-bootstrap";
import {
  ChevronRight,
  Eye,
  RotateCw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { api } from "../api";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import "../styles/ui.css";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { api: axiosapi } = useAxios();
  const { state, dispatch } = useCart();

  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const cartItem = state.items.find((item) => item.product === product?.id);
  const isInCart = !!cartItem;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product details:", err);
        if (err.response && err.response.status === 404) {
          setError("Product Not Found");
        } else {
          setError("Failed to load product details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, api]);

  const fetchCartData = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const response = await axiosapi.get("/cart/");
      const items =
        response.data.items ||
        (Array.isArray(response.data) ? response.data : []);

      dispatch({
        type: "SET_CART",
        payload: {
          items: items,
          subtotal: response.data.subtotal || 0,
          total: response.data.grand_total || 0,
          itemCount: items?.length,
        },
      });
    } catch (err) {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleUpdateQuantity = async (itemId, change) => {
    try {
      await axiosapi.patch(`/cart/items/${itemId}/`, { change });
      fetchCartData();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleAddToCart = async () => {
    if (!accessToken) return navigate("/login");
    try {
      const response = await axiosapi.post("/cart/add/", {
        product_id: product.id,
        quantity: 1,
      });

      dispatch({
        type: "SET_CART",
        payload: {
          items: response.data.items,
          subtotal: response.data.subtotal || 0,
          total: response.data.grand_total || 0,
          itemCount: response?.data?.items?.length,
        },
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to add to cart.";
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: "50vh" }}>
        <Spinner
          animation="grow"
          style={{ color: "var(--ui-accent)" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <div
          className="ui-card text-center mx-auto p-5"
          style={{ maxWidth: 520 }}
        >
          <div className="ui-eyebrow mb-2">Oops</div>
          <h3 className="ui-title">{error || "Product Not Found"}</h3>
          <p className="ui-muted mb-4">
            The product you're looking for doesn't exist or could not be loaded.
          </p>
          <Button className="btn-ink px-4" onClick={() => navigate("/")}>
            Back to Products
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-5">
      <Container>
        {/* Trail */}
        <div className="d-flex align-items-center gap-1 small mb-4 ui-muted">
          <Button
            variant="link"
            className="p-0 small text-decoration-none ui-muted"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <ChevronRight size={14} />
          <Button
            variant="link"
            className="p-0 small text-decoration-none ui-muted"
            onClick={() => navigate("/#products")}
          >
            Products
          </Button>
          <ChevronRight size={14} />
          <span className="fw-semibold" style={{ color: "var(--ui-ink)" }}>
            {product?.name}
          </span>
        </div>

        <Row className="g-5 align-items-start">
          <Col lg={6}>
            <div className="ui-card p-2 sticky-top" style={{ top: "100px" }}>
              <Image
                src={product?.image}
                alt={product?.name}
                fluid
                className="w-100"
                style={{ borderRadius: 18 }}
              />
            </div>
          </Col>

          <Col lg={6}>
            <span
              className="ui-chip mb-3"
              style={
                product?.stock > 0
                  ? {}
                  : { background: "#fdecec", color: "#c0392b" }
              }
            >
              {product?.stock > 0
                ? `${product?.stock} in stock`
                : "Out of stock"}
            </span>

            <h1 className="ui-title display-5 mb-2">{product?.name}</h1>
            <div
              className="fs-2 fw-bold mb-4"
              style={{ color: "var(--ui-accent-dark)" }}
            >
              ${product?.price}
            </div>

            <p className="ui-muted fs-5 mb-4">{product?.description}</p>

            {/* Quantity block */}
            <div className="ui-tile d-flex align-items-center justify-content-between mb-3">
              {isInCart ? (
                <>
                  <div>
                    <div className="ui-eyebrow">In your cart</div>
                    <div className="fw-semibold">Adjust quantity</div>
                  </div>
                  <QuantitySelector
                    quantity={cartItem?.quantity}
                    onQuantityChange={(newQty) => {
                      const diff = newQty - cartItem?.quantity;
                      handleUpdateQuantity(cartItem?.id, diff);
                    }}
                    max={product?.stock}
                  />
                </>
              ) : (
                <span className="ui-muted">Not in your cart yet.</span>
              )}
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 mb-4">
              {isInCart ? (
                <Button
                  size="lg"
                  className="btn-ink flex-fill py-3"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart size={20} className="me-2" />
                  Go to Cart
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="btn-accent flex-fill py-3"
                  onClick={handleAddToCart}
                  disabled={product?.stock === 0}
                >
                  <ShoppingCart size={20} className="me-2" />
                  Add to Cart
                </Button>
              )}
              <Button
                size="lg"
                className="btn-soft px-4"
                onClick={() => navigate("/cart")}
                aria-label="View cart"
              >
                <Eye size={20} />
              </Button>
            </div>

            {/* Perks */}
            <Row className="g-2">
              {[
                { icon: ShieldCheck, label: "Secure Payment" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: RotateCw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <Col xs={4} key={label}>
                  <div className="ui-card text-center p-3 h-100">
                    <Icon
                      size={22}
                      className="mb-2"
                      style={{ color: "var(--ui-accent)" }}
                    />
                    <div className="small fw-semibold">{label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;
