/**
 * Checkbox выбора времени для записи и талона для редактирования
 */
export const Checkbox = ({ label, value, onChange, checked, disabled, name, defaultChecked }) => {
  return (
    <label className={`popup__label ${defaultChecked || checked ? "popup__label_active" : ""} ${disabled ? "popup__label_disabled" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        defaultChecked={defaultChecked}
        className="popup__checkbox"
      />
      {label}
    </label>
  );
};
