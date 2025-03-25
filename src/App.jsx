import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Landing_Page/Home";
import AuthSuccess from "./Auth/AuthSuccess";
import AuthError from "./Auth/AuthError";
import SignOut from "./Auth/SignOut";
import EditorWindow from "./Code_Editor/EditorWindow";
import Login from "./Auth/Login";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/github/success" element={<AuthSuccess />} />
        <Route path="/auth/github/error" element={<AuthError />} />
        <Route
          path="/auth/github/signout"
          element={<SignOut provider="github" />}
        />
        <Route path="/code_editor" element={<EditorWindow />} />
      </Routes>
    </Router>
  );
}

export default App;
