import React from "react";

const Sidebar = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Files</h2>
      <ul>
        <li className="mb-2">File 1</li>
        <li className="mb-2">File 2</li>
        <li className="mb-2">
          Folder 1
          <ul className="ml-4">
            <li className="mb-2">File 3</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
