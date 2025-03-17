import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import { useLocation } from "react-router-dom";

function CodeEditor() {
  const [fileContent, setFileContent] = useState("");
  const location = useLocation();
  const { owner, repo, filePath } = location.state;

  useEffect(() => {
    if (filePath) {
      fetchFileContent();
    }
  }, [filePath]);

  const fetchFileContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/github/repos/${owner}/${repo}/contents/${filePath}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${document.cookie
              .split('; ')
              .find(row => row.startsWith('githubAccessToken='))
              ?.split('=')[1]}`,
          },
        }
      );
      const content = response.data.content ? atob(response.data.content) : "";
      setFileContent(content);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  if (!filePath) {
    return <div>Please select a file to view its content.</div>;
  }

  return (
    <div className="h-screen w-full p-4 bg-gray-100">
      <style jsx>{`
        .cm-scroller::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .cm-scroller::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        .cm-scroller::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        .cm-scroller::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .cm-editor {
          height: 100% !important;
        }
        .cm-scroller {
          overflow: auto !important;
        }
      `}</style>

      <div className="h-full w-full border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <CodeMirror
          value={fileContent}
          height="100%"
          extensions={[javascript({ jsx: true })]}
          theme="light"
          className="h-full"
          options={{
            lineNumbers: true,
            lineWrapping: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
