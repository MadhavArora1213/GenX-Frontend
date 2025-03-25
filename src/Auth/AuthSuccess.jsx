import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/github/success", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("User Data:", response.data);
        setUser(response.data);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="text-center text-white">🔄 Loading user data...</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">
        🎉 Welcome, {user.displayName}!
      </h1>
      <img
        src={user.avatar_url}
        alt="Profile"
        className="w-32 h-32 rounded-full shadow-lg border-2 border-white"
      />
      <p className="mt-4">
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Provider:</strong> {user.provider}
      </p>
      <a
        href="/signout"
        className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg"
      >
        Sign Out 🚪
      </a>
    </div>
  );
}

export default AuthSuccess;
