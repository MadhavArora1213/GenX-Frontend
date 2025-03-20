import React, { useState, useEffect } from "react";

function Chat() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState("");

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would add code to send the message to your AI service
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Chat Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        {isMobile && (
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {/* AI Message */}
        <div className="bg-gray-100 rounded-lg p-3 mb-3 max-w-[85%]">
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
            <span className="text-xs text-gray-400 ml-2">Just now</span>
          </div>
          <p className="text-sm">Hello! I'm your AI coding assistant. How can I help you with your project today?</p>
        </div>

        {/* Example user message */}
        <div className="bg-blue-100 rounded-lg p-3 mb-3 max-w-[85%] ml-auto">
          <div className="flex items-center justify-end mb-1">
            <span className="text-xs text-gray-400 mr-2">Just now</span>
            <span className="text-xs font-semibold text-gray-600">You</span>
          </div>
          <p className="text-sm">Can you help me understand how the code editor works in this application?</p>
        </div>

        {/* AI Response */}
        <div className="bg-gray-100 rounded-lg p-3 mb-3 max-w-[85%]">
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
            <span className="text-xs text-gray-400 ml-2">Just now</span>
          </div>
          <p className="text-sm">
            The code editor in this application is built with CodeMirror. It supports various programming languages 
            with syntax highlighting. You can select files from the sidebar, edit them in the editor, and the changes 
            will be highlighted. Would you like to know about any specific feature?
          </p>
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about your code..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className={`ml-2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              ${message.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
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
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-1 text-center">
          Powered by GenX AI
        </div>
      </div>
    </div>
  );
}

export default Chat;
