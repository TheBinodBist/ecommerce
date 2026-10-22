import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Check, List, ShoppingBag } from "lucide-react";
import "../styles/ui.css";

const OrderSuccess = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center px-3 py-5"
      style={{ minHeight: "80vh", background: "var(--ui-paper)" }}
    >
      {/* Receipt-style card */}
      <div
        className="ui-card text-center p-4 p-md-5 w-100"
        style={{ maxWidth: 460 }}
      >
        <div className="ui-ring mb-4">
          <Check size={44} strokeWidth={3} />
        </div>

        <div className="ui-eyebrow mb-2">Payment received</div>
        <h1 className="ui-title display-6 mb-3">Order Confirmed!</h1>
        <p className="ui-muted mb-4">
          Thank you for your purchase. Your order has been successfully placed
          and is now being processed.
        </p>

        <div className="ui-dashed my-4" />

        <div className="d-grid gap-2">
          <Button as={Link} to="/" className="btn-accent py-3">
            <ShoppingBag size={18} className="me-2" />
            Continue Shopping
          </Button>
          <Button as={Link} to="/dashboard/orders" className="btn-soft py-3">
            <List size={18} className="me-2" />
            View All Orders
          </Button>
        </div>

        <p className="ui-muted small mt-4 mb-0">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
