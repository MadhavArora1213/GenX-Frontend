import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ owner, repo, provider = "github" }) => {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const location = useLocation();
  
  // Add states for repository selection
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const queryParams = new URLSearchParams(location.search);
    const authSuccessParam = queryParams.get('auth_success');
    if (authSuccessParam === 'true') {
      setAuthSuccess(true);
    }
  }, [location]);

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
      
      console.log("Repository information:", { owner, repo, path });
      
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
      
      const fileData = Array.isArray(response.data) ? response.data : [response.data];
      
      console.log(`Received ${fileData.length} files/directories:`, fileData);
      setFiles(fileData);
    } catch (error) {
      console.error("Error fetching files:", error.response?.data || error);
      
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

  const handleFileClick = (file) => {
    if (file.type === "dir") {
      setPathHistory(prev => [...prev, path]);
      setPath(file.path);
      
      const container = document.querySelector('.custom-scrollbar');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
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

  const navigateTo = (newPath) => {
    setPathHistory(prev => [...prev, path]);
    setPath(newPath);
  };

  const goBack = () => {
    if (pathHistory.length > 0) {
      const prevPath = pathHistory[pathHistory.length - 1];
      setPathHistory(prev => prev.slice(0, -1));
      setPath(prevPath);
    } else if (path) {
      setPath("");
    }
  };

  const getFileIcon = (file) => {
    if (file.type === "dir") {
      return <span className="mr-2 text-yellow-400">📁</span>;
    }
    
    const filename = file.name.toLowerCase();
    const ext = filename.split('.').pop();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
      return <span className="mr-2 text-green-400">🖼️</span>;
    }
    
    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) {
      return <span className="mr-2 text-purple-400">🎬</span>;
    }
    
    if (['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(ext)) {
      return <span className="mr-2 text-pink-400">🔤</span>;
    }
    
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'rb', 'php', 'java', 'c', 'cpp', 'cs', 'go', 'rs'].includes(ext)) {
      return <span className="mr-2 text-amber-400">📜</span>;
    }
    
    if (['html', 'css', 'scss', 'less', 'xml', 'json', 'md', 'yaml', 'yml'].includes(ext)) {
      return <span className="mr-2 text-blue-400">📄</span>;
    }
    
    return <span className="mr-2 text-gray-400">📄</span>;
  };

  // Fetch user information
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/auth/github/success", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const data = await response.json();
      console.log("User Data:", data);
      setUser(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user data");
      setIsLoading(false);
      return null;
    }
  };

  // Fetch user repositories (from Home1.jsx)
  const fetchUserRepos = async () => {
    try {
      setLoadingRepos(true);
      const githubUrl = "http://localhost:3000/auth/github/repos";
      
      const response = await fetch(githubUrl, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        throw new Error(`Failed to fetch user repos: ${text}`);
      }
      
      const data = await response.json();
      console.log("User Repos:", data);
      setGithubRepos(Array.isArray(data) ? data : []);
      setLoadingRepos(false);
    } catch (err) {
      console.error("Error fetching user repos:", err);
      setError("Failed to load repositories: " + err.message);
      setLoadingRepos(false);
    }
  };

  // Handle repository selection (from Home1.jsx)
  const handleRepoClick = async (repoOwner, repoName) => {
    console.log(`Handling GitHub repository click:`, { repoOwner, repoName });
    
    if (repoOwner && repoName) {
      try {
        // Extract owner name from different possible formats
        let ownerName = repoOwner;
        
        if (typeof repoOwner === 'object') {
          ownerName = repoOwner.login || repoOwner.name || repoOwner.username || '';
        } else if (typeof repoOwner === 'string' && repoOwner.includes('/')) {
          ownerName = repoOwner.split('/')[0];
        }
        
        console.log("Selected repository:", {
          originalOwner: repoOwner,
          extractedOwner: ownerName,
          repo: repoName
        });
        
        if (!ownerName) {
          console.error("Cannot determine repository owner", { repoOwner });
          setError("Cannot open repository: unable to determine owner");
          return;
        }
        
        // Reset states for new repository
        setPath("");
        setPathHistory([]);
        setFiles([]);
        setShowRepoSelector(false);
        
        // Navigate to code editor with the selected repository
        navigate("/code_editor", { 
          state: { 
            owner: ownerName, 
            repo: repoName,
            provider: "github"
          },
          replace: true
        });
      } catch (error) {
        console.error("Error navigating to repository:", error);
        setError(`Error opening repository: ${error.message}`);
      }
    } else {
      console.error("Invalid repository data", {repoOwner, repoName});
      setError("Cannot open repository: missing required information");
    }
  };

  // Toggle repository selector
  const toggleRepoSelector = async () => {
    if (!showRepoSelector) {
      if (!user) {
        await fetchUserInfo();
      }
      fetchUserRepos();
    }
    setShowRepoSelector(!showRepoSelector);
  };

  if (!owner || !repo || showRepoSelector) {
    return (
      <div className="h-full p-4 bg-gray-800 text-white overflow-y-auto custom-scrollbar">
        <div className="flex flex-col h-full">
          {authSuccess && !showRepoSelector && (
            <div className="mb-6 text-center">
              <div className="mb-4 p-3 bg-green-600 text-white rounded-lg shadow-md inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Authentication Successful!</h2>
              <p className="text-gray-300 mb-4">You are now signed in.</p>
            </div>
          )}
          
          {!showRepoSelector ? (
            <div className="flex flex-col items-center justify-center flex-grow text-center">
              <h3 className="text-lg font-medium mb-4">No Repository Selected</h3>
              <p className="text-gray-400 text-sm mb-6">Select a repository to browse files and start coding.</p>
              
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                onClick={toggleRepoSelector}
              >
                Select Repository
              </button>
            </div>
          ) : (
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Select Repository</h3>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={toggleRepoSelector}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {user && (
                <div className="mb-4 p-3 bg-gray-700 rounded">
                  <p className="text-sm">
                    Signed in as <span className="font-semibold text-blue-400">{user.name || user.username}</span>
                  </p>
                </div>
              )}
              
              {loadingRepos ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400 mr-2"></div>
                  <p className="text-gray-400">Loading repositories...</p>
                </div>
              ) : error ? (
                <div className="bg-red-900/30 border border-red-500/50 p-3 rounded">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 mb-2">
                    {githubRepos.length} repositories found
                  </div>
                  
                  {githubRepos.length > 0 ? (
                    githubRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                        onClick={() => handleRepoClick(repo.owner?.login || repo.full_name?.split('/')[0], repo.name)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-blue-400">📁</span>
                          <h4 className="font-medium text-blue-300">
                            {repo.name}
                          </h4>
                        </div>
                        {repo.description && (
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2">{repo.description}</p>
                        )}
                        <div className="flex items-center text-xs mt-2 text-gray-400">
                          <span className="mr-3">⭐ {repo.stargazers_count}</span>
                          <span>🍴 {repo.forks_count}</span>
                          <span className="ml-auto">{repo.language}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No repositories found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

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
        <span className="truncate">{repo}</span>
        <button 
          className="p-1 bg-gray-700 rounded hover:bg-gray-600 ml-2 text-xs flex-shrink-0"
          onClick={toggleRepoSelector}
          title="Change repository"
        >
          Change
        </button>
      </h2>
      
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
      
      <div className={`bg-gray-700 p-1 sm:p-2 rounded mb-2 sm:mb-4 text-xs font-mono overflow-x-auto whitespace-nowrap ${!path ? 'opacity-50' : ''}`}>
        <span className="text-gray-400">Path: </span>
        <span className="text-blue-300">{path ? `/${path}` : '/ (root)'}</span>
      </div>
      
      <div className="mb-2 sm:mb-4 flex items-center text-xs sm:text-sm flex-wrap">
        <button 
          className="text-blue-400 hover:underline mr-1 sm:mr-2" 
          onClick={() => navigateTo("")}
        >
          root
        </button>
        
        {path && path.split('/').map((segment, index, array) => {
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
      
      {!isLoading && !error && (
        <>
          <div className="text-xs text-gray-400 mb-1 sm:mb-2">
            {files.length} items in this directory
          </div>
          <ul className="space-y-0.5 sm:space-y-1">
            {files.length > 0 ? (
              files
                .sort((a, b) => {
                  if (a.type === "dir" && b.type !== "dir") return -1;
                  if (a.type !== "dir" && b.type === "dir") return 1;
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
