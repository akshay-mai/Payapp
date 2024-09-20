import React, { ForwardedRef, forwardRef, ReactNode, useState } from 'react';


import './style.css';
import moment from 'moment';

type IInput = {
  label: string;
  value?: string | Date;
  name: string;
  placeholder?: string;
  className?: string;
  error?: string;
  onBlur?: any;
  onChange?: any;
  type?: 'text' | 'date' | 'password';
  maxLength?: number;
  postFixIcon?: ReactNode;
  postFixText?: string;
  onClickPostFixIcon?: any;
  passwordValidation?: boolean;
  ref?: any;
  onFocus?: any;
  prefix?: any;
  suffix?: any;
  autoComplete?: string;
  touched?: boolean;
  disabled?:boolean
};

const FloatInput = forwardRef(
  (
    {
      label,
      value,
      touched,
      type = 'text',
      maxLength = 20,
      name,
      className,
      placeholder,
      onFocus,
      error,
      onBlur,
      onChange,
      postFixIcon,
      postFixText,
      onClickPostFixIcon,
      prefix,
      autoComplete = 'off',
      ...rest
    }: IInput,
    ref: ForwardedRef<null>
  ) => {
    const [dateValue, setDateValue] = useState<Date | null>(value ? new Date(value as string) : null);
    const [openDate, setOpenDate] = useState<boolean>(false);

    const formGroupClass = type !== 'date' ? `form-group ${className} ${(error) && ''}` : className;

    const handleDateOpen = () => {
      setOpenDate(!openDate);
    };


    const handleDateChange=(e:any)=>{


      onChange(e)
      handleDateOpen()

    }

    return (
      <div className={formGroupClass}>
        
        {label && <label className=" label">{label}</label>}
        {prefix && prefix}
        
          <input
            type={type}
            value={value as string}
            name={name}
            maxLength={maxLength}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
            autoComplete={autoComplete}
            onFocus={onFocus}
            ref={ref}
            {...rest}
            className={(value && error ) ? 'error-input mobile':'mobile'}
            
            
          />    
        
       
        {(value && error ) && <span className="error-wrapper">{error}</span>}
        {postFixText && <div className="input-postfix-text">{postFixText}</div>}
        {postFixIcon &&
          <div
            className={ 'input-postfix-icon'}
            onClick={onClickPostFixIcon ? () => onClickPostFixIcon(name) : undefined}
          >
            {postFixIcon}
          </div>
        }
    </div>
    );
  }
);

export default FloatInput;
