import { useState } from "react";
import Header from "./Header";
import Main from "./Main/Main";
import AdminPanel from "./AdminPanel";
import Terminal from "./Terminal";

function App() {
  const [shownPanel, setShownPanel] = useState("terminal");
  
  function handleChangePanel(panel) {
    setShownPanel(panel);
  }

  return (
    <div className="page">
      <Header headerButtons={shownPanel} changePanel={handleChangePanel} />
      {shownPanel === "scoreboard" && <Main />}
      {shownPanel === "admin" && <AdminPanel />}
      {shownPanel === "terminal" && <Terminal />}
    </div>
  );
}

export default App;
