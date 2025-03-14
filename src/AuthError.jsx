import React from "react";
import { useNavigate } from "react-router-dom";

function AuthError() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        ⚠️ GitHub Login Failed
      </h1>
      <p className="text-lg text-gray-300">
        Something went wrong. Please try again later.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
      >
        🔄 Try Again
      </button>
    </div>
  );
}

export default AuthError;
