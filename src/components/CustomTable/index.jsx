import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
// import { SortingDownIcon, SortingUpIcon } from '../../assets/svg';
import Pagination from '../Pagination';
// import Loader from '../Loader';
import './CustomTable.css';

const TR = (props) => {
  const { columns, rowData, handleOnClickEvent = () => {}, index, isRowClickable = false } = props;

  const handleRowClick = (e, id) => {
    const target = e.target;
    const lastCell = e.currentTarget.querySelector('td:last-child');
    if (lastCell && lastCell.contains(target)) {
      return;
    }
    handleOnClickEvent(id);
  };

  return (
    <tr className={`${isRowClickable ? 'pointer' : ''}`} onClick={(e) => handleRowClick(e, rowData)}>
      {columns?.map((column, number) => (
        <td key={number}>
          {typeof column.renderCell === 'function' ? column.renderCell(rowData, index) : '-'}
        </td>
      ))}
    </tr>
  );
};

const CustomTable = ({
  title = '',
  data = [],
  columns = [],
  children,
  customBodyCss = '',
  totalCount = 0,
  fetchMore,
  loading,
  isSearch,
  isRowClickable = false,
  isDateRangeFilter,
  handleOnClickTr,
  onFilterChange,
  noDataMessage = 'No data found',
  searchValue = '',
  status,
  startDate,
  endDate,
}) => {
  const [perPageData] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPage] = useState(1);
  const [filter, setFilter] = useState();
  const [isSort, setIsSort] = useState(false);

  useEffect(() => {
    if (totalCount) {
      const totalPages = Math.ceil(totalCount / perPageData);
      setTotalPages(totalPages);
    }
  }, [perPageData, totalCount]);

  useEffect(() => {
    setPage(1);
  }, [isSearch, isDateRangeFilter, searchValue, status, startDate, endDate]);

  const handlePageChangeEvent = (page) => {
    setPage(page);
    if (fetchMore) {
      const safeStartDate = startDate ?? null;
      const safeEndDate = endDate ?? null;

      fetchMore({ limit: 10, page }, searchValue, status || "", safeStartDate, safeEndDate);
    }
  };

  const onSort = (column) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    let sortBy = column.value;
    if (column.value === 'lastUpdated') {
      sortBy = 'updatedAt';
    } else if (column.value === 'createdDate') {
      sortBy = 'createdAt';
    }

    const newSortOrder = isSort && (sortBy === filter?.sortBy) ? 'ASC' : 'DESC';

    setIsSort(!isSort);
    setFilter({
      ...filter,
      sortBy,
      sortOrder: newSortOrder,
    });

    onFilterChange?.({
      ...filter,
      sortBy,
      sortOrder: newSortOrder,
    });
  };

  return (
    <Row className={`custom-table ${customBodyCss}`}>
      <Col xs={12}>
        {children}
      </Col>
      <Col xs={12} className="position-relative">
        {/* {loading && <Loader />} */}
        <table className="table">
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th key={index}>
                  <div>
                    {column.label}
                    {column.isSort && (
                      <span
                        onClick={onSort(column)}
                        className={`pointer ms-1 ${(isSort && (column?.value === filter.sortBy)) && 'opacity-50'}`}
                      >
                        {/* <SortingUpIcon />  */}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row, index) => (
                <TR
                  title={title}
                  index={index + 1}
                  columns={columns}
                  rowData={row}
                  key={index}
                  isRowClickable={isRowClickable}
                  handleOnClickEvent={handleOnClickTr}
                />
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="no-data mt-2">{noDataMessage}</div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Col>
      {data.length && totalCount > 10 && (
        <Col xs={12}>
          <Row>
            <Col xs={6} className="d-flex justify-content-center justify-content-sm-start mt-3 mt-sm-0">
              <div className="d-flex dropdown-wrapper"></div>
            </Col>
            <Col xs={6} className="d-flex justify-content-center justify-content-sm-end mt-3 mt-sm-0">
              {totalPages >= 0 && (
                <Pagination
                  totalPages={totalPages}
                  activePage={pages}
                  onClick={(page) => handlePageChangeEvent(page)}
                />
              )}
            </Col>
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default CustomTable;
