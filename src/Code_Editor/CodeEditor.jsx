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
import MediaViewer from "../Preview/MediaViewer";
import DocumentPreview from "../Preview/DocumentPreview";
import { useWordWrap, getWordWrapStyles, getWordWrapConfig } from "../Extensions/WordWrapExtension";

function CodeEditor() {
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmptyFile, setIsEmptyFile] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef(null);
  const location = useLocation();
  const { owner, repo, filePath, fileName } = location.state || {};
  const [fileType, setFileType] = useState("text"); // "text", "image", "video", "font", "binary"
  const [mediaUrl, setMediaUrl] = useState("");
  
  // Use the word wrap hook
  const { isWordWrapped, toggleWordWrap } = useWordWrap();

  // Create a File object from the content for DocumentPreview
  const createFileObject = () => {
    if (!fileName) return null;
    
    try {
      // Determine mime type based on extension
      const extension = fileName.split('.').pop().toLowerCase();
      let mimeType = 'text/plain';
      
      // Map common extensions to mime types
      const mimeMap = {
        'pdf': 'application/pdf',
        'json': 'application/json',
        'html': 'text/html',
        'htm': 'text/html',
        'css': 'text/css',
        'js': 'text/javascript',
        'jsx': 'text/javascript',
        'ts': 'text/javascript',
        'tsx': 'text/javascript',
        'txt': 'text/plain',
        'md': 'text/markdown',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
      };
      
      if (mimeMap[extension]) {
        mimeType = mimeMap[extension];
      }
      
      // Make sure we have content
      const contentToUse = fileContent || '';
      const blob = new Blob([contentToUse], { type: mimeType });
      
      // Create file with proper name and size
      const file = new File([blob], fileName, { 
        type: mimeType,
        lastModified: new Date().getTime()
      });
      
      console.log(`Created File object: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
      return file;
    } catch (error) {
      console.error("Error creating File object:", error);
      return null;
    }
  };

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
    
    // Add detection for binary document formats
    const binaryDocTypes = ['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'zip', 'rar', 'tar', 'gz', 'jar', 'war', 'pdf'];
    
    if (imageTypes.includes(ext)) return "image";
    if (videoTypes.includes(ext)) return "video";
    if (fontTypes.includes(ext)) return "font";
    if (binaryDocTypes.includes(ext)) return "binary";
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
      
      console.log(`Fetching files for ${owner}/${repo}, path: ${filePath}, detected type: ${detectedFileType}`);
      
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
      
      console.log("API Response:", response.data);
      
      // Handle non-text files (media, binary, etc)
      if (detectedFileType !== "text") {
        // For non-text files, we just need the download URL
        if (response.data.download_url) {
          setMediaUrl(response.data.download_url);
          console.log(`Non-text file detected (${detectedFileType}). URL: ${response.data.download_url}`);
        } else {
          setError(`Cannot display this ${detectedFileType} file - no download URL available`);
        }
        setIsLoading(false);
        return;
      }
      
      // For text files, handle content decoding
      if (response.data.encoding === 'base64' && response.data.content) {
        try {
          // Improved base64 decoding - handle multiline base64 properly
          let encodedContent = response.data.content;
          // Remove all whitespace including newlines from base64 string
          encodedContent = encodedContent.replace(/\s/g, '');
          
          // Decode base64 content
          let decodedContent;
          try {
            decodedContent = atob(encodedContent);
            console.log(`Successfully decoded ${encodedContent.length} bytes of base64 content`);
            
            // Check if this looks like a binary file that was misidentified
            // Binary files often start with signatures like PK (ZIP/Office files)
            if (
              (decodedContent.startsWith('PK') && !fileName.endsWith('.zip')) || 
              !decodedContent.match(/^[\x20-\x7E\t\n\r\s]*$/)
            ) {
              console.log("File appears to be binary despite extension. Treating as binary file.");
              setFileType("binary");
              if (response.data.download_url) {
                setMediaUrl(response.data.download_url);
              }
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Base64 decoding failed:", e);
            throw new Error("Invalid base64 encoding");
          }
          
          // Set file content
          setFileContent(decodedContent);
          
          if (decodedContent.trim() === "") {
            console.log("File content is empty after decoding");
            setIsEmptyFile(true);
          } else {
            console.log(`Decoded content length: ${decodedContent.length} bytes`);
            // Log first few characters to verify content
            console.log(`Content preview: "${decodedContent.substring(0, 100)}${decodedContent.length > 100 ? '...' : ''}"`);
          }
        } catch (decodeError) {
          console.error("Error processing file content:", decodeError);
          
          // If decoding fails, treat as binary and use download URL
          if (response.data.download_url) {
            setFileType("binary");
            setMediaUrl(response.data.download_url);
            setIsLoading(false);
            return;
          } else {
            setError(`Content decoding error: ${decodeError.message}`);
          }
          setFileContent("");
        }
      } else if (response.data.download_url) {
        // No content provided but download URL is available - fetch directly
        console.log("No encoded content found, fetching from download URL");
        try {
          const rawResponse = await axios.get(response.data.download_url, {
            responseType: 'text',
            transformResponse: [data => data] // Prevent automatic JSON parsing
          });
          
          if (rawResponse.data) {
            console.log(`Got content from download URL: ${rawResponse.data.length} bytes`);
            setFileContent(rawResponse.data);
            if (rawResponse.data.trim() === "") {
              setIsEmptyFile(true);
            }
          } else {
            console.warn("Download URL returned no content");
            setFileContent("");
            setIsEmptyFile(true);
          }
        } catch (dlError) {
          console.error("Error fetching from download URL:", dlError);
          setError("Failed to load file content from download URL");
          setFileContent("");
        }
      } else {
        console.warn("No content or download URL available in the response");
        setFileContent("");
        setIsEmptyFile(true);
        setError("File has no accessible content");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      const errorMsg = error.response?.data?.message || `Failed to load file: ${error.message}`;
      setError(errorMsg);
      setFileContent("");
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
      // Position cursor at start for empty files - Fix setCursor error
      // CodeMirror 6 has different API compared to previous versions
      setTimeout(() => {
        if (editorRef.current) {
          try {
            // Focus the editor instead of trying to set cursor position
            // as the setCursor method doesn't exist in this version
            editorRef.current.focus();
            
            // Note: If specific cursor positioning is needed, that would require
            // using CodeMirror's state and dispatch mechanism, but focus is usually sufficient
          } catch (error) {
            console.warn("Could not focus editor:", error);
          }
        }
      }, 100);
    }
  };

  // Toggle between editor and preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Improved binary file display with file type information
  const getBinaryFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xlsx':
      case 'xls':
        return "Excel Spreadsheet";
      case 'docx':
      case 'doc':
        return "Word Document";
      case 'pptx':
      case 'ppt':
        return "PowerPoint Presentation";
      case 'pdf':
        return "PDF Document";
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return "Archive File";
      default:
        return "Binary File";
    }
  };

  if (!filePath) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50">
        <div className="text-center p-6 max-w-lg">
          <svg className="w-20 h-20 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Code Editor</h2>
          <p className="mb-4 text-gray-600">
            No file is currently selected. Please select a file from the file explorer 
            in the sidebar to start editing.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            You can use the file explorer to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Browse repositories</li>
              <li>Open and edit files</li>
              <li>Preview images and other media</li>
            </ul>
          </div>
        </div>
      </div>
    );
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
            <>
              <div className="text-xs text-gray-500">
                {isWordWrapped ? "Word Wrap: On" : "Word Wrap: Off"} (Alt+Z)
              </div>
              <button 
                onClick={togglePreview}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                {showPreview ? "Edit Mode" : "Preview Mode"}
              </button>
            </>
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
            <h3 className="text-lg font-medium text-gray-900">{getBinaryFileIcon(fileName)}</h3>
            <p className="mt-2 text-sm text-gray-500">
              This file cannot be displayed in the editor.
              {fileName?.endsWith('.xlsx') && (
                <span className="block mt-1">Excel files require external applications to view.</span>
              )}
            </p>
            {mediaUrl && (
              <a 
                href={mediaUrl} 
                download={fileName}
                className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Download File
              </a>
            )}
          </div>
        </div>
      )}
      
      {/* Text content state - show editor or preview for text files */}
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

          {!showPreview ? (
            <CodeMirror
              value={fileContent || ''}
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
          ) : (
            <div className="h-full w-full overflow-auto bg-white p-4">
              {(() => {
                const fileObj = createFileObject();
                if (fileObj) {
                  return (
                    <DocumentPreview 
                      file={fileObj} 
                      content={fileContent || ''} // Pass content directly
                      useCodeMirrorHighlighting={true}
                    />
                  );
                } else {
                  return (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Cannot create preview for this file</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
