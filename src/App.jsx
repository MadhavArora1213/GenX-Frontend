import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import AuthSuccess from "./AuthSuccess";
import AuthError from "./AuthError";
import SignOut from "./SignOut";
import EditorWindow from "./Components/EditorWindow";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
