import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import CustomDateRange from '../../DateRangePicker';
// import ProductSelect from '../../ProductSelect';
import './CustomHeaderFilter.css';
import CustomSelect from '../../CustomSelect';
// import { CSVLink } from 'react-csv';

type IHeaderFilterType = {
  title: string;
  isDateRange?: boolean;
  isDownload?: boolean;
  buttonIcon?: React.ReactNode;
  placeholder?: string;
  isDateShow?: boolean;
  handleDownload?: () => void;
  startDate?: Date | null;
  endDate?: Date | null;
  handleChange?: (dates: [Date | null, Date | null]) => void;
  handleChangeRaw?: (dates: [Date | null, Date | null]) => void;
  onDateRangeConfirm?: (startDate: Date | null, endDate: Date | null) => void;
  onDownload?: () => void;
  timeRangeOptions?: { label: string; value: string }[];
  selectedTimeRange?: string;
  onTimeRangeChange?: (value: string) => void;
}

const CustomHeaderFilter: React.FC<IHeaderFilterType> = ({
  title,
  handleDownload,
  buttonIcon,
  placeholder,
  isDateRange = false,
  isDownload = false,
  startDate = null,
  endDate = null,
  handleChange,
  handleChangeRaw,
  onDateRangeConfirm,
  onDownload,
  timeRangeOptions = [],
  selectedTimeRange = 'Past 7 Days',
  onTimeRangeChange
}) => {
  
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([startDate, endDate]);

  useEffect(() => {
    const platformObject = JSON.parse(localStorage.getItem('platformObject') || '{}');
    if (platformObject && platformObject.createdAt) {
      setCreatedAt(new Date(platformObject.createdAt));
    }
  }, []);
  
  useEffect(() => {
    setDateRange([null, null]);
  }, [selectedTimeRange]);

  const handleDateRangeConfirm = (startDate: Date | null, endDate: Date | null) => {
    console.log('Date Range Confirmed:', startDate, endDate);
    if (onDateRangeConfirm) {
      onDateRangeConfirm(startDate, endDate);
    }
  };

  return (
    <div className="custom-header-filter-section">
      <Row className="filter-wrapper">
        <Col xs={12} sm={12} md={6} className="p-0 d-flex flex-column justify-content-start">
          <div className="title">{title}</div>
          {/* <ProductSelect /> */}
        </Col>
        <Col xs={12} sm={12} md={6} className="p-0 d-flex justify-content-end align-items-center">
          <d  iv className='header-wrapper'>
            {timeRangeOptions.length > 0 && (
              <div className='time-rage-wrapper'>
                <div className="d-flex justify-content-between align-items-center">
             
              <p className='label-timeRange'>Showing data of : </p>

                </div>
              <CustomSelect
                className="time-range-select"
                name="timeRange"
                placeholder={selectedTimeRange || 'Past 7 Days'}
                onChange={(selectedOption: any) => onTimeRangeChange?.(selectedOption?.value)}
                value={timeRangeOptions.find(option => option.value === selectedTimeRange)}
                options={timeRangeOptions}
              />
              </div>
            )}

            {isDateRange && (
              <CustomDateRange
                startDate={startDate}
                endDate={endDate}
                handleChange={(dates: [Date | null, Date | null]) => handleChange && handleChange(dates)}
                placeholder="DD/MM/YYYY  --  DD/MM/YYYY"
                dateFormat="dd/MM/yyyy"
                onDateRangeConfirm={handleDateRangeConfirm}
                minDate={createdAt || undefined}  
              />
            )}

          </d>
          {isDownload && (
              <button className="download-btn" onClick={onDownload}>
                {buttonIcon}
                {placeholder}
              </button>
            )}
        </Col>
      </Row>
    </div>
  );
};

export default CustomHeaderFilter;
