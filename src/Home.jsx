import { useEffect, useState } from "react";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [gitlabRepos, setGitlabRepos] = useState([]);

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
        fetchUserRepos(data.provider);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        setLoading(false);
      });
  }, []);

  const fetchUserRepos = (provider) => {
    const githubUrl = "http://localhost:3000/auth/github/repos";
    const gitlabUrl = "http://localhost:3000/auth/gitlab/repos";

    if (provider === "github") {
      fetchRepos(githubUrl, setGithubRepos);
    } else if (provider === "gitlab") {
      fetchRepos(gitlabUrl, setGitlabRepos);
    } else {
      fetchRepos(githubUrl, setGithubRepos);
      fetchRepos(gitlabUrl, setGitlabRepos);
    }
  };

  const fetchRepos = (url, setRepos) => {
    fetch(url, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user repos");
        }
        return res.json();
      })
      .then((data) => {
        console.log("User Repos:", data);
        setRepos(data);
      })
      .catch((err) => {
        console.error("Error fetching user repos:", err);
        setError("Failed to load user repos");
      });
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
            Your {user.provider === "github" ? "GitHub" : "GitLab"} ID:{" "}
            <span className="text-yellow-400">{user.id}</span>
          </p>
          <p className="text-gray-300">
            Provider: <span className="text-blue-400">{user.provider}</span>
          </p>

          <a
            href={
              user.provider === "github"
                ? "/auth/github/signout"
                : "/auth/gitlab/signout"
            }
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
                    className="bg-gray-700 p-4 rounded-lg shadow-lg"
                  >
                    <a
                      href={repo.html_url}
                      className="text-blue-400"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h4 className="text-lg font-semibold">{repo.name}</h4>
                    </a>
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

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-400">
              Your GitLab Repositories:
            </h3>
            {gitlabRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {gitlabRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-gray-700 p-4 rounded-lg shadow-lg"
                  >
                    <a
                      href={repo.web_url}
                      className="text-blue-400"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h4 className="text-lg font-semibold">{repo.name}</h4>
                    </a>
                    <p className="text-gray-300">{repo.description}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      <strong>Stars:</strong> {repo.star_count} |{" "}
                      <strong>Forks:</strong> {repo.forks_count}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 mt-4">
                No GitLab repositories found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
