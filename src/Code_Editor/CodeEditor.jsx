import React, { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import axios from "axios";
import { useLocation } from "react-router-dom";
import MediaViewer from "./MediaViewer";
import { useWordWrap, getWordWrapStyles, getWordWrapConfig } from "./WordWrapExtension";

function CodeEditor() {
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmptyFile, setIsEmptyFile] = useState(false);
  const editorRef = useRef(null);
  const location = useLocation();
  const { owner, repo, filePath, fileName } = location.state;
  const [fileType, setFileType] = useState("text"); // "text", "image", "video", "font", "binary"
  const [mediaUrl, setMediaUrl] = useState("");
  
  // Use the word wrap hook
  const { isWordWrapped, toggleWordWrap } = useWordWrap();

  useEffect(() => {
    if (filePath) {
      fetchFileContent();
    }
  }, [filePath]);

  const isMediaFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const fontTypes = ['ttf', 'otf', 'woff', 'woff2', 'eot'];
    
    if (imageTypes.includes(ext)) return "image";
    if (videoTypes.includes(ext)) return "video";
    if (fontTypes.includes(ext)) return "font";
    return "text";
  };

  const fetchFileContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsEmptyFile(false);
      
      // Check if this is a media file
      const detectedFileType = isMediaFile(fileName);
      setFileType(detectedFileType);
      
      console.log(`Fetching files for ${owner}/${repo}, path: ${filePath}`);
      
      // Encode path components to handle special characters in path names
      const encodedPath = encodeURIComponent(filePath);
      const encodedOwner = encodeURIComponent(owner || '');
      const encodedRepo = encodeURIComponent(repo || '');
      
      if (!encodedRepo) {
        throw new Error("Invalid repository information");
      }
      
      if (!encodedOwner) {
        throw new Error("Missing repository owner");
      }
      
      const apiUrl = `http://localhost:3000/api/github/repos/${encodedOwner}/${encodedRepo}/contents/${encodedPath}`;
      console.log(`Using GitHub API URL: ${apiUrl}`);
      
      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });
      
      if (detectedFileType !== "text") {
        // For media files, we just need the download URL
        if (response.data.download_url) {
          setMediaUrl(response.data.download_url);
          console.log(`Media file detected. URL: ${response.data.download_url}`);
        } else {
          setError("Cannot display this media file - no download URL available");
        }
        setIsLoading(false);
        return;
      }
      
      // For text files, handle as before
      if (response.data.encoding === 'base64' && response.data.content) {
        try {
          // Try to decode as text
          const content = atob(response.data.content.replace(/\n/g, ''));
          setFileContent(content);
          
          if (content.trim() === "") {
            setIsEmptyFile(true);
          }
          
          // Log success for debugging
          console.log(`Successfully loaded file content (${content.length} bytes)`);
        } catch (decodeError) {
          console.error("Error decoding content:", decodeError);
          
          // This might be a binary file we can't render as text
          if (response.data.download_url) {
            setFileType("binary");
            setMediaUrl(response.data.download_url);
          } else {
            setError("This file cannot be displayed (binary or encoding issue)");
          }
          setFileContent("");
        }
      } else {
        console.log("File has no content or is not properly encoded");
        setFileContent("");
        setIsEmptyFile(true);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      const errorMsg = error.response?.data?.message || `Failed to load file: ${error.message}`;
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine language extension based on file extension
  const getLanguageExtension = () => {
    if (!fileName) return javascript();
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return javascript({ jsx: true });
      case 'ts':
      case 'tsx':
        return javascript({ typescript: true });
      case 'html':
      case 'htm':
        return html();
      case 'css':
        return css();
      case 'py':
        return python();
      case 'json':
        return json();
      case 'md':
        return markdown();
      default:
        return javascript();
    }
  };

  // Handle editor mount to focus on empty files
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    if (isEmptyFile && editorRef.current) {
      // Position cursor at start for empty files
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setCursor(0, 0);
        }
      }, 100);
    }
  };

  if (!filePath) {
    return <div className="p-4">Please select a file to view its content.</div>;
  }

  // Get word wrap configuration for CodeMirror
  const wordWrapConfig = getWordWrapConfig(isWordWrapped);

  return (
    <div className="h-screen w-full p-2 sm:p-4 bg-gray-100">
      {/* File info header - more responsive */}
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-xs sm:text-sm bg-white rounded px-2 py-1 sm:px-3 sm:py-1.5 shadow border border-gray-200 mb-1 sm:mb-0 overflow-hidden">
          <span className="font-semibold block sm:inline">{fileName}</span>
          <span className="text-gray-500 text-xs sm:ml-2 block sm:inline truncate max-w-[250px] sm:max-w-md">({filePath})</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {fileType !== "text" ? 
              `File type: ${fileType}` : 
              (isEmptyFile ? "Empty file" : `${fileContent.split("\n").length} lines`)
            }
          </div>
          {fileType === "text" && (
            <div className="text-xs text-gray-500">
              {isWordWrapped ? "Word Wrap: On" : "Word Wrap: Off"} (Alt+Z)
            </div>
          )}
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-[90%]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
          <p className="text-gray-500">Loading file content...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="flex justify-center items-center h-[90%] bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {/* Media file display */}
      {!isLoading && !error && (fileType === "image" || fileType === "video" || fileType === "font") && (
        <MediaViewer 
          url={mediaUrl} 
          type={fileType} 
          filename={fileName}
        />
      )}
      
      {/* Binary file display */}
      {!isLoading && !error && fileType === "binary" && (
        <div className="h-[90%] flex flex-col items-center justify-center bg-gray-50 border-2 border-gray-300 rounded-lg">
          <div className="text-center p-6 max-w-md">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Binary File</h3>
            <p className="mt-2 text-sm text-gray-500">This file cannot be displayed in the editor.</p>
            {mediaUrl && (
              <a 
                href={mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Download File
              </a>
            )}
          </div>
        </div>
      )}
      
      {/* Text content state - show editor for text files */}
      {!isLoading && !error && fileType === "text" && (
        <div className="h-[90%] w-full border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <style jsx="true">{`
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
            .cm-placeholder {
              color: #9ca3af;
              font-style: italic;
            }
            ${getWordWrapStyles(isWordWrapped)}
          `}</style>

          <CodeMirror
            value={fileContent}
            height="100%"
            width="100%"
            extensions={[getLanguageExtension()]}
            theme="light"
            className="h-full w-full"
            placeholder={isEmptyFile ? "This file is empty" : ""}
            onChange={(value) => setFileContent(value)}
            onCreateEditor={handleEditorDidMount}
            options={wordWrapConfig.options}
            basicSetup={wordWrapConfig.basicSetup}
          />
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
