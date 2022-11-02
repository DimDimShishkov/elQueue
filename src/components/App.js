import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Main from "./Main/Main";
import AdminPanel from "./AdminPanel";
import Terminal from "./Terminal";
import NoPage from "./NoPage";

function App() {
  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<Main />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="terminal" element={<Terminal />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
