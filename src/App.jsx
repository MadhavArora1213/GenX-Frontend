// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./Home";
// import AuthSuccess from "./AuthSuccess";
// import AuthError from "./AuthError";
// import SignOut from "./SignOut";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/auth/github/success" element={<AuthSuccess />} />
//         <Route path="/auth/github/error" element={<AuthError />} />
//         <Route
//           path="/auth/github/signout"
//           element={<SignOut provider="github" />}
//         />
//         <Route
//           path="/auth/gitlab/signout"
//           element={<SignOut provider="gitlab" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import React, { useState } from "react";
// import CodeEditor from "./Code_Editor/CodeEditor";

// function App() {
//   const [code, setCode] = useState("");

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>GenX Code Editor</h2>
//       <CodeEditor language="javascript" onChange={setCode} />
//       <button onClick={() => console.log("Final Code:", code)}>Submit</button>
//     </div>
//   );
// }

// export default App;
import React from "react";
import EditorWindow from "./Components/EditorWindow";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <EditorWindow />
    </div>
  );
}

export default App;
