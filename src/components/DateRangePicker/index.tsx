import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import Button from '../Button';
import { CalenderIcon } from '../../assets/svg';
import './DateRangePicker.css';
import { useCustomToast } from '../../contexts/CustomToastContext';

type DateType = Date | null;
type IInput = {
  startDate: DateType;
  endDate: DateType;
  handleChange: (dates: [Date | null, Date | null]) => void;
  placeholder: string;
  dateFormat: string;
  onDateRangeConfirm?: (startDate: Date | null, endDate: Date | null) => void;
  minDate?: Date;
};

const MAX_DAYS = 90;

const CustomDateRange: React.FC<IInput> = ({
  startDate,
  endDate,
  handleChange,
  placeholder,
  dateFormat,
  onDateRangeConfirm
}) => {
  const datePickerRef = useRef<any>(null);
  const [localStartDate, setLocalStartDate] = useState<DateType>(startDate);
  const [localEndDate, setLocalEndDate] = useState<DateType>(endDate);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { setMessage } = useCustomToast();

  const appCreationDate = localStorage.getItem('platformObject')
    ? new Date(JSON.parse(localStorage.getItem('platformObject') || '{}').createdAt)
    : null;

  const todayDate = new Date();
  const maxAllowedDate = localStartDate
  ? new Date(localStartDate.getTime() + MAX_DAYS * 24 * 60 * 60 * 1000)
  : todayDate;

const effectiveMaxDate = todayDate < maxAllowedDate ? todayDate : maxAllowedDate;


  useEffect(() => {
    setIsFilterApplied(!!localStartDate || !!localEndDate);
  }, [localStartDate, localEndDate]);

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);
  

  const handleCancel = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    datePickerRef?.current?.setOpen(false);
  };

  const handleDone = () => {
    if (localStartDate && localEndDate) {
      const diffDays = (localEndDate.getTime() - localStartDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays > MAX_DAYS) {
        setMessage({
          text: `The date range cannot exceed ${MAX_DAYS} days.`,
          show: true,
          success: false,
        });
        setLocalStartDate(null);
        setLocalEndDate(null);
        handleChange([null, null]);
        if (onDateRangeConfirm) {
          onDateRangeConfirm(null, null);
        }
      } else {
        handleChange([localStartDate, localEndDate]);
        if (onDateRangeConfirm) {
          onDateRangeConfirm(localStartDate, localEndDate);
        }
      }
    }
    datePickerRef?.current?.setOpen(false);
  };

  const handleClearFilter = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    handleChange([null, null]);
    if (onDateRangeConfirm) {
      onDateRangeConfirm(null, null);
    }
  };

  const handleIconClick = () => {
    datePickerRef?.current?.setOpen(true);
  };

  const CalenderContainerWrapper = ({ className, children }: { className: string; children: React.ReactNode | React.ReactNode[] }) => {
    return (
      <div className="pb-3 bg-white shadow rounded justify-content-end d-flex flex-column align-items-end">
        <CalendarContainer className={`${className} border-0`}>
          {children}
        </CalendarContainer>
        <hr className="m-0 hr-wrapper"/>
        <div className="d-flex align-items-end w-75 justify-content-end gap-3 pe-3">
          {isFilterApplied && (
            <Button
              title="Clear"
              className="clear-filter-btn-wrapper"
              onClick={handleClearFilter}
            />
          )}
          <Button
            title="Cancel"
            className="cancel-btn-wrapper"
            onClick={handleCancel}
          />
          <Button
            title="Done"
            className="apply-btn-wrapper"
            onClick={handleDone}
            disabled={!(localStartDate && localEndDate)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-main">
      <div className="d-flex justify-content-between align-items-center">
        <p className="date-range-title">Date Range:</p>
      </div>
      <div className="date-range-contain">
        <DatePicker
          ref={datePickerRef}
          showIcon={false}
          selectsRange
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          startDate={localStartDate}
          endDate={localEndDate}
          toggleCalendarOnIconClick={false} 
          onChange={(dates: [DateType, DateType] | null) => {
            if (Array.isArray(dates)) {
              setLocalStartDate(dates[0]);
              setLocalEndDate(dates[1]);
            }
          }}
          dateFormat={dateFormat}
          placeholderText={placeholder}
          shouldCloseOnSelect={false}
          calendarContainer={CalenderContainerWrapper}
          minDate={appCreationDate || undefined}
          maxDate={effectiveMaxDate}
        />
      </div>
      <div className="calendar-icon-container" onClick={handleIconClick}>
        <CalenderIcon />
      </div>
    </div>
  );
};

export default CustomDateRange;
