import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold">Logo</span>
          <span className="ml-2 text-lg">GenX</span>
        </div>

        {/* Navigation Items */}
        <div className="flex space-x-4">
          <button className="px-2 py-1 text-sm hover:bg-gray-100 rounded">
            File
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-100 rounded">
            Edit
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-100 rounded">
            View
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-100 rounded">
            Run
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-100 rounded">
            Terminal
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-100 rounded">
            Help
          </button>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded hover:bg-gray-100">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>AI Assist</span>
        </button>
        <button className="px-3 py-1.5 bg-gray-900 text-white rounded font-medium">
          Share
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
