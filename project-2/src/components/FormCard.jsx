// export default function FormCard({ title, children }) {
//   return (
//     <div
//       style={{
//         maxWidth: "600px",
//         margin: "3rem auto",
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//         padding: "1.5rem",
//         background: "#fff"
//       }}
//     >
//       {title && <h3 style={{ marginBottom: "1rem" }}>{title}</h3>}
//       {children}
//     </div>
//   );
// }

// /* ========== SHARED STYLES ========== */

// export const fieldStyle = {
//   marginBottom: "1rem",
//   display: "flex",
//   flexDirection: "column"
// };

// export const inputStyle = {
//   padding: "0.6rem",
//   border: "1px solid #ccc",
//   borderRadius: "4px"
// };

// export const primaryBtn = {
//   flex: 1,
//   padding: "0.7rem",
//   background: "#0d6efd",
//   color: "#fff",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer"
// };

// export const secondaryBtn = {
//   flex: 1,
//   padding: "0.7rem",
//   background: "#f1f1f1",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   cursor: "pointer"
// };

// // const cardStyle = {
// //   maxWidth: "420px",
// //   margin: "3rem auto",
// //   padding: "2rem",
// //   border: "1px solid #ddd",
// //   borderRadius: "8px",
// //   background: "#fff"
// // };

import '../styles/FormCard.css';

export default function FormCard({ title, subtitle, children }) {
  return (
    <div className="form-card">
      {title && <h2 className="form-card-title">{title}</h2>}
      {subtitle && <p className="form-card-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}

export const fieldStyle = {
  marginBottom: "1.25rem",
  display: "flex",
  flexDirection: "column"
};

export const inputStyle = {
  padding: "0.75rem",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  fontSize: "1rem",
  fontFamily: "inherit",
  transition: "all 0.2s"
};

export const primaryBtn = {
  flex: 1,
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "transform 0.2s, box-shadow 0.2s"
};

export const secondaryBtn = {
  flex: 1,
  padding: "0.75rem 1.5rem",
  background: "#f5f5f5",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.2s"
};