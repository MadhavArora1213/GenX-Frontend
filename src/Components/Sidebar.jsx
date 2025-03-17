import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ owner, repo }) => {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (owner && repo) {
      console.log(`Fetching files for owner: ${owner}, repo: ${repo}`);
      fetchFiles();
    }
  }, [path, owner, repo]);
  
  const fetchFiles = async () => {
    try {
      const apiUrl = path
        ? `http://localhost:3000/api/github/repos/${owner}/${repo}/contents/${path}`
        : `http://localhost:3000/api/github/repos/${owner}/${repo}/contents`;

      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error.response?.data || error);
    }
  };

  const handleFileClick = (file) => {
    if (file.type === "dir") {
      // If it's a directory, update the path to show its contents
      setPath(file.path);
    } else {
      // If it's a file, navigate to code editor
      navigate("/code_editor", { state: { owner, repo, filePath: file.path } });
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 h-full overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Repository Files</h2>
      
      {/* Add breadcrumb navigation */}
      {path && (
        <div className="mb-4 flex items-center text-sm">
          <button 
            className="text-blue-400 hover:underline mr-2" 
            onClick={() => setPath("")}
          >
            Root
          </button>
          {path.split('/').map((segment, index, array) => {
            const currentPath = array.slice(0, index + 1).join('/');
            return (
              <React.Fragment key={index}>
                <span className="mx-1">/</span>
                <button 
                  className="text-blue-400 hover:underline"
                  onClick={() => setPath(currentPath)}
                >
                  {segment}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
      
      <ul className="space-y-2">
        {files
          .sort((a, b) => (a.type === "dir" ? -1 : 1))
          .map((file) => (
            <li 
              key={file.path} 
              onClick={() => handleFileClick(file)}
              className="cursor-pointer hover:bg-gray-700 px-2 py-1 rounded flex items-center"
            >
              {file.type === "dir" ? 
                <span className="mr-2 text-yellow-400">📁</span> : 
                <span className="mr-2 text-blue-400">📄</span>
              } 
              {file.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
