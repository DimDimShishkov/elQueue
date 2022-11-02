/**
 * Checkbox выбора времени для записи и талона для редактирования
 */
export const Checkbox = ({ label, value, onChange, checked, name, defaultChecked }) => {
  
  return (
    <label className={`popup__label ${(defaultChecked || checked) && "popup__label_active"}`}>
      <input
        type="checkbox"
       checked={checked}
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
