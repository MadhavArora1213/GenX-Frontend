import React from "react";

const SecondaryNavbar = ({
  toggleLeftPanel,
  toggleRightPanel,
  leftVisible,
  rightVisible,
  isMobile,
  activePanel,
  switchToPanel
}) => {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-2 py-1.5">
      <div className="flex items-center space-x-2">
        {/* Toggle sidebar button (desktop only) */}
        {!isMobile && (
          <button 
            onClick={toggleLeftPanel}
            className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100"
            title={leftVisible ? "Hide files panel" : "Show files panel"}
          >
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
                d={leftVisible ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"}
              />
            </svg>
          </button>
        )}

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
          <span className="ml-1 text-sm hidden sm:inline">Run</span>
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
          <span className="ml-1 text-sm hidden sm:inline">Debug</span>
        </button>

        <button className="hidden sm:flex items-center justify-center p-1.5 rounded hover:bg-gray-100">
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

        {/* Project name - hidden on smallest screens */}
        <div className="hidden sm:block ml-2 px-3 py-1 text-sm bg-gray-50 border border-gray-200 rounded truncate max-w-[160px] md:max-w-xs">
          my-genx-project
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        {/* Toggle AI Chat button (desktop only) */}
        {!isMobile && (
          <button 
            onClick={toggleRightPanel}
            className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100"
            title={rightVisible ? "Hide AI chat" : "Show AI chat"}
          >
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
                d={rightVisible ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
            <span className="ml-1 hidden lg:inline text-sm">
              {rightVisible ? "Hide AI" : "Show AI"}
            </span>
          </button>
        )}
        
        {/* Authentication buttons - show only GitHub login */}
        <button className="hidden md:flex items-center px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
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
      </div>
    </div>
  );
};

export default SecondaryNavbar;
