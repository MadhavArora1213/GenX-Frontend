import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

function CodeEditor() {
  const code = `// Welcome to GenX AI-Powered Editor
function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

// AI suggestion: Consider adding memoization for better performance
const result = calculateFactorial(5);
console.log(\`The factorial of 5 is \${result}\`);

// TODO: Add error handling for negative numbers
`;

  return (
    <div className="h-screen w-full p-4 bg-gray-100">
      <style jsx>{`
        /* Custom scrollbar styles */
        .cm-scroller::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .cm-scroller::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        .cm-scroller::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        .cm-scroller::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        /* Ensure full height */
        .cm-editor {
          height: 100% !important;
        }
        .cm-scroller {
          overflow: auto !important;
        }
      `}</style>

      <div className="h-full w-full border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[javascript({ jsx: true })]}
          theme="light"
          className="h-full"
          options={{
            lineNumbers: true,
            lineWrapping: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
