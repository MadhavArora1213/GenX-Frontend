import React from "react";

function Sidebar() {
  return (
    <div
      className="sidebar h-screen"
      style={{
        height: "100%",
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ddd",
        overflow: "auto",
      }}
    >
      {/* File explorer and other sidebar content */}
      <div className="sidebar-section">
        <h3>Files</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>index.js</li>
          <li>styles.css</li>
          <li>app.js</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
