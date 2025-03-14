import React, { useState } from "react";
import { Resizable } from "re-resizable";
import CodeEditor from "../Code_Editor/CodeEditor";
import Navbar from "./Navbar";
import SecondaryNavbar from "./SecondaryNavbar";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const EditorWindow = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SecondaryNavbar />
      <div className="flex flex-grow">
        <Resizable
          defaultSize={{ width: sidebarWidth, height: "100%" }}
          minWidth={200}
          maxWidth={600}
          onResizeStop={(e, direction, ref, d) => {
            setSidebarWidth(sidebarWidth + d.width);
          }}
          className="bg-gray-200"
        >
          <Sidebar />
        </Resizable>
        <div className="flex-1 flex flex-col">
          <CodeEditor />
        </div>
        <Resizable
          defaultSize={{ width: rightPanelWidth, height: "100%" }}
          minWidth={200}
          maxWidth={600}
          onResizeStop={(e, direction, ref, d) => {
            setRightPanelWidth(rightPanelWidth + d.width);
          }}
          className="bg-gray-100 border-l"
        >
          <Chat />
        </Resizable>
      </div>
    </div>
  );
};

export default EditorWindow;
