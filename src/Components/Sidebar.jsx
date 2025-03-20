import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ owner, repo, provider = "github" }) => {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  // Add state to track scrolling activity
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add effect to handle scroll events for animation
  useEffect(() => {
    const sidebarElement = document.querySelector('.custom-scrollbar');
    if (!sidebarElement) return;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };
    
    sidebarElement.addEventListener('scroll', handleScroll);
    return () => {
      sidebarElement.removeEventListener('scroll', handleScroll);
      clearTimeout(window.scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (repo) {
      console.log(`Fetching files for ${owner ? owner + '/' : ''}${repo}, path: ${path}`);
      fetchFiles();
    } else {
      console.error("Missing repository information:", { owner, repo, provider });
    }
  }, [path, owner, repo]);
  
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Debug outputs for troubleshooting
      console.log("Repository information:", { owner, repo, path });
      
      // Encode path components to handle special characters in path names
      const encodedPath = path ? encodeURIComponent(path) : '';
      const encodedOwner = encodeURIComponent(owner || '');
      const encodedRepo = encodeURIComponent(repo || '');
      
      if (!encodedRepo) {
        throw new Error("Invalid repository information");
      }
      
      if (!encodedOwner) {
        throw new Error("Missing repository owner for GitHub repo");
      }
      
      const apiUrl = path
        ? `http://localhost:3000/api/github/repos/${encodedOwner}/${encodedRepo}/contents/${encodedPath}`
        : `http://localhost:3000/api/github/repos/${encodedOwner}/${encodedRepo}/contents`;
        
      console.log(`Using GitHub API URL: ${apiUrl}`);
      console.log(`Requesting files from: ${apiUrl}`);
      
      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });
      
      // GitHub may return a single object or an array
      const fileData = Array.isArray(response.data) ? response.data : [response.data];
      
      console.log(`Received ${fileData.length} files/directories:`, fileData);
      setFiles(fileData);
    } catch (error) {
      console.error("Error fetching files:", error.response?.data || error);
      
      // Enhanced error handling with more user-friendly messages
      let errorMsg;
      
      if (error.response?.status === 404) {
        errorMsg = `Path not found in repository "${owner}/${repo}"`;
      } else if (error.response?.status === 403) {
        errorMsg = "Access denied. You may not have permission to view this repository.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else {
        errorMsg = error.message || "Failed to load files. Please try again.";
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleFileClick to include smooth scrolling
  const handleFileClick = (file) => {
    if (file.type === "dir") {
      // If it's a directory, update the path to show its contents
      setPathHistory(prev => [...prev, path]); // Save current path to history
      setPath(file.path);
      
      // Scroll to top smoothly when changing directories
      const container = document.querySelector('.custom-scrollbar');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If it's a file, navigate to code editor
      navigate("/code_editor", { 
        state: { 
          owner, 
          repo, 
          filePath: file.path,
          fileName: file.name,
          provider: "github"
        } 
      });
    }
  };

  // Function to navigate to a specific path level
  const navigateTo = (newPath) => {
    setPathHistory(prev => [...prev, path]); // Save current path to history
    setPath(newPath);
  };

  // Function to go back to previous path
  const goBack = () => {
    if (pathHistory.length > 0) {
      const prevPath = pathHistory[pathHistory.length - 1];
      setPathHistory(prev => prev.slice(0, -1));
      setPath(prevPath);
    } else if (path) {
      // If no history but we're in a subfolder, go to root
      setPath("");
    }
  };

  // Function to determine file icon based on file extension
  const getFileIcon = (file) => {
    if (file.type === "dir") {
      return <span className="mr-2 text-yellow-400">📁</span>;
    }
    
    const filename = file.name.toLowerCase();
    const ext = filename.split('.').pop();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
      return <span className="mr-2 text-green-400">🖼️</span>;
    }
    
    // Video files
    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) {
      return <span className="mr-2 text-purple-400">🎬</span>;
    }
    
    // Font files
    if (['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(ext)) {
      return <span className="mr-2 text-pink-400">🔤</span>;
    }
    
    // Code files
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'rb', 'php', 'java', 'c', 'cpp', 'cs', 'go', 'rs'].includes(ext)) {
      return <span className="mr-2 text-amber-400">📜</span>;
    }
    
    // Markup and style files
    if (['html', 'css', 'scss', 'less', 'xml', 'json', 'md', 'yaml', 'yml'].includes(ext)) {
      return <span className="mr-2 text-blue-400">📄</span>;
    }
    
    // Default file icon
    return <span className="mr-2 text-gray-400">📄</span>;
  };

  return (
    <div 
      className={`bg-gray-800 text-white p-2 sm:p-4 h-full overflow-auto custom-scrollbar ${
        isScrolling ? 'scrolling' : ''
      }`}
      style={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        scrollbarColor: '#6366F1 #1F2937'
      }}
    >
      {/* Add custom scrollbar styles */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4F46E5;
          border-radius: 8px;
          border: 2px solid #1F2937;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366F1;
        }
        
        .custom-scrollbar.scrolling::-webkit-scrollbar-thumb {
          background: #818CF8;
          box-shadow: 0 0 5px rgba(129, 140, 248, 0.5);
        }
        
        .custom-scrollbar {
          transition: scrollbar-color 0.3s ease;
        }
      `}</style>

      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center justify-between">
        <span>Repository Files</span>
        {isMobile && (
          <button className="p-1 bg-gray-700 rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        )}
      </h2>
      
      {/* Navigation controls with responsive styling */}
      <div className="flex flex-wrap items-center mb-2 sm:mb-4 gap-1 sm:gap-2">
        <button 
          className={`bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs sm:text-sm flex-shrink-0 ${
            (!path && pathHistory.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={goBack}
          disabled={!path && pathHistory.length === 0}
        >
          ← Back
        </button>
        
        <button 
          className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs sm:text-sm flex-shrink-0"
          onClick={() => navigateTo("")}
        >
          Root
        </button>
        
        <button
          className="ml-auto bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs sm:text-sm flex-shrink-0"
          onClick={() => fetchFiles()}
        >
          🔄 Refresh
        </button>
      </div>
      
      {/* Current path display with responsive text size */}
      <div className={`bg-gray-700 p-1 sm:p-2 rounded mb-2 sm:mb-4 text-xs font-mono overflow-x-auto whitespace-nowrap ${!path ? 'opacity-50' : ''}`}>
        <span className="text-gray-400">Path: </span>
        <span className="text-blue-300">{path ? `/${path}` : '/ (root)'}</span>
      </div>
      
      {/* Condensed breadcrumb on mobile */}
      <div className="mb-2 sm:mb-4 flex items-center text-xs sm:text-sm flex-wrap">
        <button 
          className="text-blue-400 hover:underline mr-1 sm:mr-2" 
          onClick={() => navigateTo("")}
        >
          root
        </button>
        
        {path && path.split('/').map((segment, index, array) => {
          // On mobile with deep nesting, only show the last 2 segments
          if (isMobile && index < array.length - 2 && array.length > 3) {
            if (index === array.length - 3) {
              return <span key={index} className="mx-1">...</span>;
            }
            return null;
          }
          
          const currentPath = array.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={index}>
              <span className="mx-1">/</span>
              <button 
                className="text-blue-400 hover:underline truncate max-w-[80px] sm:max-w-none"
                onClick={() => navigateTo(currentPath)}
              >
                {segment}
              </button>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Loading and error states */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400 mr-2"></div>
          <p className="text-gray-400">Loading files...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {/* Files and folders list with responsive sizing */}
      {!isLoading && !error && (
        <>
          <div className="text-xs text-gray-400 mb-1 sm:mb-2">
            {files.length} items in this directory
          </div>
          <ul className="space-y-0.5 sm:space-y-1">
            {files.length > 0 ? (
              files
                .sort((a, b) => {
                  // Directories first, then files
                  if (a.type === "dir" && b.type !== "dir") return -1;
                  if (a.type !== "dir" && b.type === "dir") return 1;
                  // Alphabetical sort within each type
                  return a.name.localeCompare(b.name);
                })
                .map((file) => (
                  <li 
                    key={file.path} 
                    onClick={() => handleFileClick(file)}
                    className="cursor-pointer hover:bg-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md flex items-center"
                  >
                    {getFileIcon(file)}
                    <span className="truncate text-sm">{file.name}</span>
                  </li>
                ))
            ) : (
              <div className="text-center py-4 sm:py-8 text-gray-400">
                <p>No files found in this directory</p>
                {path && (
                  <button 
                    onClick={() => navigateTo("")}
                    className="mt-2 text-blue-400 hover:underline text-xs sm:text-sm"
                  >
                    Return to root directory
                  </button>
                )}
              </div>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
