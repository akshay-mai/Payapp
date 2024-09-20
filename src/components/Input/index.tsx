import React, { ForwardedRef, forwardRef } from 'react';
import { HidePasswordEyeIcon, ShowPasswordEyeIcon } from '../../assets/svg';
import './Input.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TooltipProps } from 'react-bootstrap';

interface IInputProps  {
  label?: any;
  htmlFor?: string;
  className?: string;
  type?: 'text' | 'date' | 'password' | 'textarea' | 'email';
  eye?: boolean;
  onEyeClick?: () => void;
  error?: string;
  refProp?: any;
  value?: string;
  isRequired?: boolean;
  name?: string;
  maxLength?: number;
  onBlur?: any;
  onFocus?: any;
  onChange?: any;
  touched?: boolean;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  postFixIcon?:any
}

const Input = forwardRef(
  (
    {
      label,
      htmlFor,
      className = '',
      type = 'text',
      eye,
      onEyeClick,
      error,
      refProp = false,
      isRequired = false,
      value,
      name,
      maxLength= 20,
      touched,
      onBlur,
      onFocus,
      autoComplete = 'off',
      placeholder,
      onChange,
      disabled = false,
      postFixIcon,
      ...rest
    }: IInputProps,
    ref: ForwardedRef<null>
  ) => {
    const formGroupClass = `form-input ${className} ${(error && value) && 'error-input'}`;
    const QuestionToopTip = (
      props: JSX.IntrinsicAttributes &
        TooltipProps &
        React.RefAttributes<HTMLDivElement>,
    ) => (
      <Tooltip {...props}>
        {"Domain required for payment gateway verification"}
      </Tooltip>
    );

    return (
      <div className={formGroupClass}>
        {isRequired ? (
          label && <label htmlFor={htmlFor} className="required">{label}</label>
        ) : (
          label && <label htmlFor={htmlFor}>{label}</label>
        )}
        <>
          {type === 'textarea' ? (
            <textarea
              className={`main ${className}`}
              name={name}
              ref={ref}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              disabled={disabled}
              maxLength={maxLength}
              {...rest}
            />
            ) : (
            <input
              type={eye ? 'text' : type}
              value={value as string}
              name={name}
              maxLength={maxLength}
              placeholder={placeholder}
              onChange={onChange}
              autoComplete={autoComplete}
              onFocus={onFocus}
              disabled={disabled}
              ref={ref}
              {...rest}
            />
          )}
          {eye !== undefined && (
            <div className="eye-icon" onClick={onEyeClick}>
              {eye ? <ShowPasswordEyeIcon /> : <HidePasswordEyeIcon />}
            </div>
          )}
           {postFixIcon &&
          <div
            className={ 'input-postfix-icon'}
            // onClick={onClickPostFixIcon ? () => onClickPostFixIcon(name) : undefined}
          >
            <OverlayTrigger placement="right-start" overlay={QuestionToopTip}>

            <img src={postFixIcon} className='post-icon'/>
            </OverlayTrigger>
            {/* {postFixIcon} */}
          </div>
        }
          {(error && value) && <span className="error-wrapper">{error}</span>}
        </>
      </div>
    );
  }
);

export default Input;
