export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.25rem" }}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />
    </div>
  );
}