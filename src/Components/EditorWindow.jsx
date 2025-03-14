import React, { useState, useRef, useEffect } from 'react';
import Navbar from "./Navbar";
import SecondaryNavbar from "./SecondaryNavbar";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import CodeEditor from "../Code_Editor/CodeEditor";
import { Resizable } from 're-resizable';


function EditorWindow() {
      const [leftWidth, setLeftWidth] = useState(250);
  const [rightWidth, setRightWidth] = useState(400);
  return (
    <>
      <div className="h-screen w-full">
        <main>
          <div className="h-1/5 w-full">
            <nav>
              {" "}
              <Navbar />{" "}
            </nav>
            <nav>
              {" "}
              <SecondaryNavbar />{" "}
            </nav>
          </div>
          <div className="h-[80%] w-full flex justify-center items-center">
            <div className="">
              <Resizable
                size={{ width: leftWidth, height: "100%" }}
                onResizeStop={(e, direction, ref, d) => {
                  setLeftWidth(leftWidth + d.width);
                }}
                enable={{ right: true }}
                minWidth={180}
                maxWidth={400}
              >
                <Sidebar />
              </Resizable>
            </div>
            <div className="h-[80%] w-[60%]">
              <CodeEditor />
            </div>
            <div className="h-[80%] w-[20%]">
              <Resizable
                size={{ width: rightWidth, height: "100%" }}
                onResizeStop={(e, direction, ref, d) => {
                  setRightWidth(rightWidth + d.width);
                }}
                enable={{ left: true }}
                minWidth={300}
                maxWidth={600}
              >
                <Chat />
              </Resizable>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default EditorWindow;



