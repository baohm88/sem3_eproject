import { useEffect, useState } from "react";
import { Form, Badge } from "react-bootstrap";

/**
 * TagInput – nhập skills dưới dạng CSV nhưng UX tốt hơn
 * props:
 * - value: string (csv) | string[]
 * - onChange: (csvString)=>void
 * - placeholder?
 */
export default function TagInput({ value, onChange, placeholder = "e.g. bike, city, english" }) {
  const [text, setText] = useState("");

  const arr = Array.isArray(value)
    ? value
    : (value || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  useEffect(() => {
    // keep text synced if outside changes
    setText(arr.join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (raw) => {
    const csv = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(",");
    onChange?.(csv);
  };

  const removeAt = (i) => {
    const next = arr.filter((_, idx) => idx !== i).join(",");
    onChange?.(next);
    setText(next.replace(/,/g, ", "));
  };

  return (
    <>
      <Form.Control
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          commit(e.target.value);
        }}
      />
      <div className="mt-2 d-flex flex-wrap gap-2">
        {arr.map((t, i) => (
          <Badge key={i} bg="secondary">
            {t}{" "}
            <span
              role="button"
              className="ms-1"
              onClick={() => removeAt(i)}
              aria-label="remove"
            >
              ×
            </span>
          </Badge>
        ))}
      </div>
    </>
  );
}
