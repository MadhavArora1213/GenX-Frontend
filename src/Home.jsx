import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/auth/github/success", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        console.log("User Data:", data);
        setUser(data);
        fetchUserRepos();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        setLoading(false);
      });
  }, []);

  const fetchUserRepos = () => {
    const githubUrl = "http://localhost:3000/auth/github/repos";
    fetchRepos(githubUrl, setGithubRepos);
  };

  const fetchRepos = (url, setRepos) => {
    fetch(url, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error("Error response:", text);
            throw new Error(`Failed to fetch user repos: ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("User Repos:", data);
        setRepos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching user repos:", err);
        setError("Failed to load user repos: " + err.message);
      });
  };

  const handleRepoClick = async (owner, repo) => {
    console.log(`Handling GitHub repository click:`, { owner, repo });
    
    // Make sure we have valid owner and repo names before navigating
    if (owner && repo) {
      try {
        // Extract owner name from different possible formats
        let ownerName = owner;
        
        // Handle different owner object formats
        if (typeof owner === 'object') {
          ownerName = owner.login || owner.name || owner.username || '';
        } else if (typeof owner === 'string' && owner.includes('/')) {
          // Handle case where owner might be in "username/repo" format
          ownerName = owner.split('/')[0];
        }
        
        // Log information for debugging
        console.log("Navigating to repository:", {
          originalOwner: owner,
          extractedOwner: ownerName,
          repo: repo
        });
        
        if (!ownerName) {
          console.error("Cannot determine repository owner", { owner });
          setError("Cannot open repository: unable to determine owner");
          return;
        }
        
        navigate("/code_editor", { 
          state: { 
            owner: ownerName, 
            repo: repo,
            provider: "github"
          } 
        });
      } catch (error) {
        console.error("Error navigating to repository:", error);
        setError(`Error opening repository: ${error.message}`);
      }
    } else {
      console.error("Invalid repository data", {owner, repo});
      setError("Cannot open repository: missing required information");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold text-blue-400">Welcome to GenX 🚀</h1>

      {loading ? (
        <p className="text-gray-300 mt-4 animate-pulse">Loading user data...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-400">
            Hello, {user.name}!
          </h2>
          <p className="text-gray-300">
            Your GitHub ID:{" "}
            <span className="text-yellow-400">{user.id}</span>
          </p>
          <p className="text-gray-300">
            Provider: <span className="text-blue-400">{user.provider}</span>
          </p>

          <a
            href="/auth/github/signout"
            className="mt-4 inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Logout
          </a>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-400">
              Your GitHub Repositories:
            </h3>
            {githubRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {githubRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-gray-700 p-4 rounded-lg shadow-lg cursor-pointer"
                    onClick={() => {
                      console.log("GitHub repository clicked:", repo);
                      handleRepoClick(repo.owner?.login || repo.full_name?.split('/')[0], repo.name);
                    }}
                  >
                    <h4 className="text-lg font-semibold text-blue-400">
                      {repo.name}
                    </h4>
                    <p className="text-gray-300">{repo.description}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      <strong>Stars:</strong> {repo.stargazers_count} |{" "}
                      <strong>Forks:</strong> {repo.forks_count}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 mt-4">
                No GitHub repositories found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
