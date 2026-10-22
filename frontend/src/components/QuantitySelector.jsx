import { Button, Form } from "react-bootstrap";
import { Minus, Plus } from "lucide-react";
import "../styles/ui.css";

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  min = 0,
  max = 99,
}) => {
  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    const clampedValue = Math.max(0, Math.min(max, value));
    onQuantityChange(clampedValue);
  };

  return (
    <div className="ui-qty">
      <Button
        variant="light"
        className="ui-qty-btn"
        onClick={handleDecrement}
        disabled={quantity <= 0}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </Button>

      <Form.Control
        type="number"
        className="ui-qty-input p-0 shadow-none"
        value={quantity}
        onChange={handleInputChange}
      />

      <Button
        variant="light"
        className="ui-qty-btn"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </Button>
    </div>
  );
};

export default QuantitySelector;
