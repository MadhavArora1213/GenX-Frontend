import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SecondaryNavbar from "./SecondaryNavbar";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import CodeEditor from "../Code_Editor/CodeEditor";
import { Resizable } from "re-resizable";
import { useLocation } from "react-router-dom";

function EditorWindow() {
  const [leftWidth, setLeftWidth] = useState(250);
  const [rightWidth, setRightWidth] = useState(400);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState("editor"); // "sidebar", "editor", "chat"
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);
  const location = useLocation();
  const { owner, repo, filePath } = location.state || {};

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, only show the editor by default
      if (mobile && activePanel === "") {
        setActivePanel("editor");
      }
      
      // On larger screens but not huge, hide right panel by default
      if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        setRightVisible(false);
      } else if (window.innerWidth >= 1280) {
        setRightVisible(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [activePanel]);

  // Switch active panel for mobile view
  const switchToPanel = (panel) => {
    setActivePanel(panel);
  };

  // Toggle sidebar visibility
  const toggleLeftPanel = () => {
    setLeftVisible(!leftVisible);
  };

  // Toggle chat visibility
  const toggleRightPanel = () => {
    setRightVisible(!rightVisible);
  };

  // Calculate dynamic widths for non-mobile view
  const getMainContentWidth = () => {
    let width = "100%";
    if (!isMobile) {
      // Calculate remaining space after sidebar and chat
      const sidebarWidth = leftVisible ? leftWidth : 0;
      const chatWidth = rightVisible ? rightWidth : 0;
      width = `calc(100% - ${sidebarWidth}px - ${chatWidth}px)`;
    }
    return width;
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-100">
      {/* Navigation */}
      <div className="flex-shrink-0">
        <Navbar />
        <SecondaryNavbar 
          toggleLeftPanel={toggleLeftPanel} 
          toggleRightPanel={toggleRightPanel}
          leftVisible={leftVisible}
          rightVisible={rightVisible}
          isMobile={isMobile}
          activePanel={activePanel}
          switchToPanel={switchToPanel}
        />
      </div>

      {/* Mobile tab navigation */}
      {isMobile && (
        <div className="flex border-b border-gray-300 bg-gray-200">
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activePanel === 'sidebar' ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => switchToPanel('sidebar')}
          >
            Files
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activePanel === 'editor' ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => switchToPanel('editor')}
          >
            Editor
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activePanel === 'chat' ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => switchToPanel('chat')}
          >
            AI Chat
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar - hidden on mobile if not active */}
        {(!isMobile && leftVisible) || (isMobile && activePanel === 'sidebar') ? (
          <Resizable
            size={{ width: isMobile ? "100%" : leftWidth, height: "100%" }}
            onResizeStop={(e, direction, ref, d) => {
              if (!isMobile) {
                setLeftWidth(Math.min(Math.max(leftWidth + d.width, 180), 500));
              }
            }}
            enable={{ right: !isMobile }}
            className={`${isMobile ? 'w-full' : 'w-auto'} bg-gray-800 overflow-hidden z-10`}
            minWidth={isMobile ? "100%" : 180}
            maxWidth={isMobile ? "100%" : 400}
          >
            <Sidebar owner={owner} repo={repo} />
          </Resizable>
        ) : null}

        {/* Code Editor - hidden on mobile if not active */}
        {(!isMobile) || (isMobile && activePanel === 'editor') ? (
          <div 
            className={`${isMobile ? 'w-full' : 'flex-grow'} overflow-hidden`}
            style={{ width: isMobile ? "100%" : getMainContentWidth() }}
          >
            <CodeEditor />
          </div>
        ) : null}

        {/* Chat panel - hidden on mobile if not active */}
        {(!isMobile && rightVisible) || (isMobile && activePanel === 'chat') ? (
          <Resizable
            size={{ width: isMobile ? "100%" : rightWidth, height: "100%" }}
            onResizeStop={(e, direction, ref, d) => {
              if (!isMobile) {
                setRightWidth(Math.min(Math.max(rightWidth + d.width, 300), 600));
              }
            }}
            enable={{ left: !isMobile }}
            className={`${isMobile ? 'w-full' : 'w-auto'} bg-white overflow-hidden z-10`}
            minWidth={isMobile ? "100%" : 300}
            maxWidth={isMobile ? "100%" : 400}
          >
            <Chat />
          </Resizable>
        ) : null}
      </div>
    </div>
  );
}

export default EditorWindow;
