import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is returning from GitHub OAuth
    const urlParams = new URLSearchParams(location.search);
    const authSuccess = urlParams.get('success');
    
    // If authentication was successful, redirect to code editor
    if (authSuccess === 'true') {
      navigate('/code_editor');
    }
  }, [location, navigate]);

  const handleGithubLogin = async () => {
    setIsAuthenticating(true);
    setError('');
    
    try {
      // The backend uses a direct redirect to GitHub OAuth instead of a POST endpoint
      window.location.href = 'http://localhost:3000/auth/github';
      
      // Note: The rest of this function won't execute due to the page navigation
      // But we'll keep the error handling for any pre-navigation errors
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Failed to connect to authentication server');
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">GenX</h1>
        </Link>
        
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Welcome Back</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={handleGithubLogin}
            disabled={isAuthenticating}
            className={`w-full flex items-center justify-center gap-2 ${isAuthenticating ? 'bg-gray-400' : 'bg-gray-800 hover:bg-black'} text-white py-3 px-4 rounded-md transition-colors duration-300`}
          >
            {isAuthenticating ? (
              'Authenticating...'
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Login with GitHub
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center text-gray-600">
          <p>Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;