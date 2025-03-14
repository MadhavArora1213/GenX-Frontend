import React from "react";

const Chat = () => {
  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">Chat</h2>
      <div className="flex-1 bg-white p-2 rounded-lg overflow-auto">
        <p>Chat messages will be displayed here.</p>
      </div>
      <input
        type="text"
        className="mt-2 p-2 border rounded-lg"
        placeholder="Type a message..."
      />
    </div>
  );
};

export default Chat;
