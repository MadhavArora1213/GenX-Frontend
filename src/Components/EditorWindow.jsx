import React from "react";
import Navbar from "./Navbar";
import SecondaryNavbar from "./SecondaryNavbar";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import CodeEditor from "../Code_Editor/CodeEditor";

function EditorWindow() {
  return (
    <>
      <div className="h-screen w-full">
        <main>
          <div className="h-1/5 w-full">
            <nav> <Navbar/> </nav>
            <nav> <SecondaryNavbar/> </nav>
          </div>
          <div className="h-[80%] w-full flex justify-center items-center">
            <div className="h-[80%] w-[20%]">
              <Sidebar/>
            </div>
            <div className="h-[80%] w-[60%]">
             <CodeEditor/>
            </div>
            <div className="h-[80%] w-[20%]">
              <Chat/>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default EditorWindow;
