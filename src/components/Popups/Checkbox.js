/**
 * Checkbox выбора времени для записи
 */
export const Checkbox = ({ label, value, onChange, checked, name }) => {
  return (
    <label className={`main__label ${checked && "main__label_active"}`}>
      <input type="checkbox" checked={checked} name={name} value={value} onChange={onChange} className="main__checkbox" />
      {label}
    </label>
  );
};
