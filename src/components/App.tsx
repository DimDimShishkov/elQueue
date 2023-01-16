import { useEffect, useState } from "react";
import AddTicketPopup from "./Popups/AddTicketPopup";
import EditTicketPopup from "./Popups/EditTicketPopup";
import Header from "./Header";
import Main from "./Main/Main";
import Panel from "./Panel";
import TicketPopup from "./Popups/TicketPopup";

function App() {
  const [isEditTicketPopupOpen, setEditTicketPopupOpen] = useState(false);
  const [isNewTicketPopupOpen, setNewTicketPopupOpen] = useState(false);
  const [isTicketPopupOpen, setTicketPopupOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function closeAllPopups() {
    setEditTicketPopupOpen(false);
    setNewTicketPopupOpen(false);
    setTicketPopupOpen(false);
  }

  function handleTicketToDelete(ticket: any) {
    setTicketToDelete(ticket);
    setTicketPopupOpen(true);
  }

  return (
    <div className="page" id="page">
      <Header />
      <Main ticketToDelete={handleTicketToDelete} />
      <Panel
        editTicketPopup={setEditTicketPopupOpen}
        newTicketPopup={setNewTicketPopupOpen}
        currentTime={currentTime}
        currentDate={currentDate}
      />
      {/* переделать на порталы? */}
      {isNewTicketPopupOpen && (
        <AddTicketPopup
          isOpen={isNewTicketPopupOpen}
          onClose={closeAllPopups}
        />
      )}
      {isEditTicketPopupOpen && (
        <EditTicketPopup
          isOpen={isEditTicketPopupOpen}
          onClose={closeAllPopups}
        />
      )}
      {ticketToDelete && (
        <TicketPopup
          isOpen={isTicketPopupOpen}
          onClose={closeAllPopups}
          ticket={ticketToDelete}
        />
      )}
    </div>
  );
}

export default App;
