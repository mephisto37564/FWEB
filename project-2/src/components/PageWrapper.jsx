// export default function PageWrapper({ children }) {
//   return (
//     <div style={{
//       maxWidth: "1200px",
//       margin: "0 auto",
//       padding: "2rem 1rem"
//     }}>
//       {children}
//     </div>
//   );
// }

import '../styles/PageWrapper.css';

export default function PageWrapper({ children }) {
  return (
    <div className="page-wrapper">
      {children}
    </div>
  );
}