import React from 'react';
import Select from 'react-select';
import './CustomSelect.css';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: '50px',
    border: '1px solid #E6E9EF',
    backgroundColor: state.isDisabled ? '#EFEFEF' : '#FFFFFF',
    borderRadius: '10px',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '10px',
    border: '1px solid #E6E9EF',
    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.05)',
    zIndex: 999,
    marginTop: '3px',
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#404040',
    fontSize: '16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E6E9EF',
  }),
  placeholder: (provided) => ({
    ...provided,
    margin: '0',
    padding: '8px 12px',
    color: '#A0A0A0',
    fontSize: '14px',
  }),
};

const CustomSelect = ({
  disabled = false,
  searchable = false,
  onChange,
  value,
  placeholder,
  placement = 'bottom',
  label,
  options,
  className,
  name,
  isMulti = false,
  onFocus,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
}) => {
  return (
    <div className={`custom-select-main ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <Select
        classNamePrefix="custom-select"
        isDisabled={disabled}
        isSearchable={searchable}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        options={options}
        styles={customStyles}
        menuPlacement={placement}
        name={name}
        isMulti={isMulti}
        onFocus={onFocus}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
      />
    </div>
  );
};

export default CustomSelect;
