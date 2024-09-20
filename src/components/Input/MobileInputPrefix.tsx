import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import './mobilestyle.css';

// const menuItems = [
//   {
//     label: 'IN',
//     value: '+91',
//   },
//   {
//     label: 'BRAZIL',
//     value: '+55',
//   },
//   {
//     label: 'CANADA',
//     value: '+1',
//   },
// ];
//
// interface SelectedValuesProps {
//   label: string;
//   value: string;
// }

interface MobileInputPrefixProps {
  handleSelectCountryCode?: (data: string) => void;
  countryCode: string;
  label: string;
}

const MobileInputPrefix: React.FC<MobileInputPrefixProps> = ({ countryCode, label }) => {

  // const handleItemClick = (item:SelectedValuesProps) => {
  //   handleSelectCountryCode(item.value)
  // };

  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="contact-form-input-dropdown">
      <Dropdown
        show={open}
        onToggle={() => setOpen(!open)}
        className="contact-dropdown"
        aria-disabled={true}
      >
        <Dropdown.Toggle className="contact-dropdown-btn" disabled={true}>
          <span>
            {countryCode ? countryCode : label}
          </span>
        </Dropdown.Toggle>
        {/*<Dropdown.Menu className="contact-dropdown-menu">*/}
        {/*  {menuItems.map((item, index) => (*/}
        {/*    <Dropdown.Item*/}
        {/*      eventKey={item.label}*/}
        {/*      key={index}*/}
        {/*      onClick={() => handleItemClick(item)}*/}
        {/*      className="contact-dropdown-item"*/}
        {/*    >*/}
        {/*      <span className="value">*/}
        {/*        {item.value}*/}
        {/*      </span>*/}
        {/*    </Dropdown.Item>*/}
        {/*  ))}*/}
        {/*</Dropdown.Menu>*/}
      </Dropdown>
    </div>
  )
}
export default MobileInputPrefix;
