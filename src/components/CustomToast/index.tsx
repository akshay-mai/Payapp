import React from 'react';
import { useCustomToast } from '../../contexts/CustomToastContext';
// import { SuccessToastIcon, FailedIcon, CrossIcon } from '../../assets/svg/index';
import './CustomToast.css';

export type IMessage = {
  success: boolean,
  text: string,
  show: boolean
}

const CustomToast = () => {
  const { message: { success, text, show }, setMessage } = useCustomToast();

  const handleCloseToast = () => {
    setMessage({
      success: success,
      text: text,
      show: false,
    })
  }

  return (
    <div
      className={`custom-toast-container ${!show ? 'toast' : 'toast-exit-active'} ${success ? 'toast-success' : 'toast-error'}`}
      onClick={() => setMessage({
        text: '',
        success: false,
        show: false
      })}
    >
      <div className='d-flex align-items-center'>
        {success ? <SuccessToastIcon /> : <FailedIcon />}
      </div>
      <div>
        {!success && <p className="failed-text">Failed!</p>}
        <p>{text}</p>
      </div>
      <button className="close-button" onClick={handleCloseToast}>
        <CrossIcon fill="#404040" />
      </button>
    </div>
  );
}

export default CustomToast;
