import { useEffect } from "react";

/**
 * попап с созданным талоном
 */
export default function InfoPopup({ isOpen, onClose, isInfo, isErr = false, isEdit = false, isDelete = false }) {
  const renderContent = () => {
    if (isErr) {
      return (
        <div className="popup__container">
          <h2 className="popup__title">{isInfo}</h2>
        </div>
      );
    }
    if (isEdit) {
      return (
        <div className="popup__container">
          <h2 className="popup__title">Внесены изменения в талон {isInfo.type + isInfo.id}</h2>
        </div>
      );
    }
    if (isDelete) {
      return (
        <div className="popup__container">
          <h2 className="popup__title">Талон {isInfo.type + isInfo.id} удален</h2>
        </div>
      );
    }
    return (
      <div className="popup__container">
        <h2 className="popup__title">Талон {isInfo.type + isInfo.id} создан</h2>
        <h2 className="popup__title">Ожидайте вызова на табло</h2>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(function () {
      onClose();
    }, 2000);
  }, [isInfo, onClose]);

  return <div className={`popup ${isOpen && "popup_opened"}`}>{renderContent()}</div>;
}
