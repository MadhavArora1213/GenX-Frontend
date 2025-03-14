import React from "react";

const SecondaryNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-gray-100 shadow-sm text-sm text-gray-700">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
          Explorer
        </button>
        <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
          Source Control
        </button>
        <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
          Extensions
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
          Problems
        </button>
        <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
          Output
        </button>
        <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
          Debug Console
        </button>
        <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
          Terminal
        </button>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
