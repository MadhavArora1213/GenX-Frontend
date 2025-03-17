import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ owner, repo }) => {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, [path]);

const fetchFiles = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/github/repos/${owner}/${repo}/contents/`,
      {
        withCredentials: true,
      }
    );
    setFiles(response.data);
  } catch (error) {
    console.error("Error fetching files:", error.response?.data || error);
  }
};



  const handleFileClick = (filePath) => {
    navigate("/code_editor", { state: { owner, repo, filePath } });
  };

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
      <div className="sidebar-section">
        <h3>Files</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {files
            .sort((a, b) => (a.type === "dir" ? -1 : 1))
            .map((file) => (
              <li
                key={file.path}
                onClick={() =>
                  file.type === "dir"
                    ? setPath(file.path)
                    : handleFileClick(file.path)
                }
              >
                {file.type === "dir" ? "📁" : "📄"} {file.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
