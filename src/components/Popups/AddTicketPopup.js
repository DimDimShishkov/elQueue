import PopupWithForm from "./PopupWithForm";

/**
 * попап добавления талона
 */
export default function AddTicketPopup({ isOpen, onClose }) {
  return <PopupWithForm isOpen={isOpen} onClose={onClose} isAddTicketForm={true} title={"Записаться к врачу"} />;
}
