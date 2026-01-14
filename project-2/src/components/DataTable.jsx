export default function DataTable({
  columns,
  data,
  renderActions,
  actions,
  onRowClick
}) {
  const handleRowClick = (e, item) => {
    // Don't trigger row click if clicking on action buttons
    if (e.target.closest("button")) {
      return;
    }
    if (onRowClick) {
      onRowClick(item);
    }
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "1rem"
      }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #ddd" }}>
          {columns.map(col => (
            <th
              key={col}
              style={{ padding: "0.75rem", textAlign: "left" }}
            >
              {col}
            </th>
          ))}

          {/* Multiple action columns */}
          {actions &&
            actions.map(action => (
              <th
                key={action.label}
                style={{ padding: "0.75rem", textAlign: "left" }}
              >
                {action.label}
              </th>
            ))}

          {/* Single actions column */}
          {renderActions && !actions && (
            <th style={{ padding: "0.75rem", textAlign: "left" }}>
              Actions
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {data.map(item => (
          <tr 
            key={item._id || item.id} 
            style={{ 
              borderBottom: "1px solid #eee",
              cursor: onRowClick ? "pointer" : "default",
              transition: "background-color 0.2s"
            }}
            onClick={(e) => handleRowClick(e, item)}
            onMouseEnter={(e) => {
              if (onRowClick) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {columns.map(col => {
              const key = col.toLowerCase();
              return (
                <td key={key} style={{ padding: "0.75rem" }}>
                  {item[key]}
                </td>
              );
            })}

            {/* Multiple action cells */}
            {actions &&
              actions.map(action => (
                <td
                  key={action.label}
                  style={{ padding: "0.75rem" }}
                >
                  {action.render(item)}
                </td>
              ))}

            {/* Single action cell */}
            {renderActions && !actions && (
              <td style={{ padding: "0.75rem" }}>
                {renderActions(item)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}