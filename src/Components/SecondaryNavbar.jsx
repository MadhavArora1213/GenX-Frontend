import React from "react";

const SecondaryNavbar = () => {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-2 py-1.5">
      <div className="flex items-center space-x-2">
        {/* Action buttons */}
        <button className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
          </svg>
          <span className="ml-1 text-sm">Run</span>
        </button>

        <button className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span className="ml-1 text-sm">Debug</span>
        </button>

        <button className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7l4-4m0 0l4 4m-4-4v18"
            />
          </svg>
          <span className="ml-1 text-sm">Deploy</span>
        </button>

        {/* Project name */}
        <div className="ml-2 px-3 py-1 text-sm bg-gray-50 border border-gray-200 rounded">
          my-genx-project
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          GitHub Login
        </button>

        <button className="flex items-center px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          GitLab Login
        </button>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
