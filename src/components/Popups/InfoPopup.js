import { useEffect } from "react";

/**
 * попап с созданным талоном
 */
export default function InfoPopup({ isOpen, onClose, isInfo, isErr = false, isEdit = false, isDelete = false }) {
  let content;
  if (isErr) {
    content = (
      <div className="popup__container">
        <h2 className="popup__title">{isInfo}</h2>
      </div>
    );
  } else if (isEdit) {
    content = (
      <div className="popup__container">
        <h2 className="popup__title">Внесены изменения в талон {isInfo.type + isInfo.id}</h2>
      </div>
    );
  } else if (isDelete) {
    content = (
      <div className="popup__container">
        <h2 className="popup__title">Талон {isInfo.type + isInfo.id} удален</h2>
      </div>
    );
  } else {
    content = (
      <div className="popup__container">
        <h2 className="popup__title">Талон {isInfo.type + isInfo.id} создан</h2>
        <h2 className="popup__title">Ожидайте вызова на табло</h2>
      </div>
    );
  }

  useEffect(() => {
    setTimeout(function () {
      onClose();
    }, 2000);
  }, [isInfo, onClose]);

  return <div className={`popup ${isOpen && "popup_opened"}`}>{content}</div>;
}
