import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import useEffectOnce from '../../../hooks/useEffectOnce';
import useDebounce from '../../../hooks/useDebounce';
import CustomSelect from '../../CustomSelect';
// import { CSVLink } from 'react-csv';
import './CustomTableFilter.css';

const CustomTableFilter = ({
    clearFilter,
    handleFilterChange,
    searchPlaceholder = "Search",
    isSearch = false,
    isStatus = false,
    isBulkUpload = false,
    statusOptions = [],
    handleBulkUpload,
    onStatusChange,
    transactionData = [],
}) => {
  const [filter, setFilter] = useState({});
  const [searchText, setSearchText] = useState('');
  const [statusOption, setStatusOption] = useState([]);

  useEffectOnce(() => {
    if (statusOptions.length) {
      setStatusOption(statusOptions);
    }
  });

  const handleChange = (name, option) => {
    setFilter({ ...filter, [name]: option.value });
    handleFilterChange?.({ ...filter, [name]: option.value });
    
    if (name === 'status' && onStatusChange) {
      onStatusChange(option.value);
    }
  };

  const debouncedFn = useDebounce((newValue) => {
    setFilter({ ...filter, newValue });
    handleFilterChange?.({ ...filter, newValue });
  }, 800);

  const handleSearchOnChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
    debouncedFn(value);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilter({});
    handleFilterChange?.({});
    clearFilter?.();
  };

  const generateCSVData = () => {
    return transactionData.map(transaction => ({
      'Transaction ID': transaction.id,
      'Date': transaction.date,
      'Amount': transaction.amount,
      'Status': transaction.status,
    }));
  };

  return (
    <div className="custom-table-filter-section">
      <Row className="filter-wrapper">
        <Col xs={12} sm={12} md={6} className="p-0 d-flex justify-content-start align-items-center">
          {isSearch && (
            <div className="search-input-main">
              <div className="search-btn">
                {/* <SearchIcon /> */}
              </div>
              <input
                type="text"
                name="search"
                placeholder={searchPlaceholder}
                className="search-input"
                value={searchText}
                onChange={handleSearchOnChange}
              />
              {searchText && (
                <div className="cross-btn" onClick={handleClearFilters}>
                  {/* <CrossIcon /> */}
                </div>
              )}
            </div>
          )}
        </Col>
        <Col
          xs={12} sm={12} md={6}
          className="p-0 d-flex justify-content-start justify-content-lg-end align-items-center"
        >
          {isStatus && (
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="status-text">View by Status</div>
              <CustomSelect
                name="status"
                placeholder="-- All --"
                onChange={(option) => handleChange('status', option)}
                options={statusOption}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
              />
            </div>
          )}
          
        </Col>
      </Row>
    </div>
  );
};

export default CustomTableFilter;
