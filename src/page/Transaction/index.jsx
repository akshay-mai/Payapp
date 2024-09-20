import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import CustomHeaderFilter from '../../components/FilterSection/CustomHeaderFilter';
import CustomTable from '../../components/CustomTable';
import CustomTableFilter from '../../components/FilterSection/CustomTableFilter';
import './Transaction.css';
import { axiosInstance } from '../../api';

const TransactionOption = [
  { label: '-- All --', value: 'All' },
  { label: 'Success', value: 'Success' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
];

const Transaction = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [sortColumn, setSortColumn] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [totalCount, setTotalCount] = useState(1);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    fetchTransactions({ limit: 10, page: 1 }, search, status, start, end);
  };

  const handleCopyKey = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  const fetchTransactions = async (paginationDetails, search, status, startDate, endDate, sortField = sortColumn, sortOrder = sortDirection.toUpperCase()) => {
    const appId = localStorage.getItem('appId');
    
    if (!appId) {
      return {
        success: false,
        message: 'platformId is missing in local storage.',
      };
    }

    try {
      setIsLoading(true);

      let url = `/transaction`;

      const queryParams = [];
      if (status && status !== 'All') queryParams.push(`status=${status.toUpperCase()}`);
      if (startDate) queryParams.push(`startDate=${moment(startDate).format('YYYY-MM-DD')}`);
      if (endDate) queryParams.push(`endDate=${moment(endDate).format('YYYY-MM-DD')}`);
      if (search) queryParams.push(`search=${search}`);
      if (paginationDetails) queryParams.push(`limit=${paginationDetails.limit}&page=${paginationDetails.page}`);
      queryParams.push(`sortField=${sortField}`);
      queryParams.push(`sortOrder=${sortOrder}`);

      if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

      const response = await axiosInstance.get(url);
      setTransactionData(response.data.result[0]);
      setTotalCount(response.data.result[1]);

      return {
        success: true,
        data: response.data.result,
        message: response.data.message,
      };
    } catch (e) {
      return {
        success: false,
        message: e?.response?.data?.message || 'An error occurred while fetching transactions.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions({ limit: 10, page: 1 }, search, status, startDate, endDate);
  }, [search, status, startDate, endDate, sortColumn, sortDirection]);
//   useEffect(()=>{
// console.log('fetching trans')
// fetchTransactions({ limit: 10, page: 1 }, search, status, startDate, endDate);

//   },[])

  const handleSearch = (e) => {
    setSearch(e.newValue);
  };

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
  };

  const handleDownload = async () => {
    const appId = localStorage.getItem('platformId');

    if (!appId) {
      return;
    }

    try {
      setIsLoading(true);

      let url = `/dashboard/${appId}/download/transactions`;

      const queryParams = [];
      if (status && status !== 'All') queryParams.push(`status=${status.toUpperCase()}`);
      if (startDate) queryParams.push(`startDate=${moment(startDate).format('YYYY-MM-DD')}`);
      if (endDate) queryParams.push(`endDate=${moment(endDate).format('YYYY-MM-DD')}`);
      if (search) queryParams.push(`search=${search}`);
      queryParams.push(`sortField=${sortColumn}`);
      queryParams.push(`sortOrder=${sortDirection.toUpperCase()}`);

      if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

      const response = await axiosInstance.get(url, { responseType: 'blob' });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error('Error downloading transactions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyTooltip = (props) => (
    <Tooltip {...props}>
      {copySuccess ? "Copied!" : "Copy to clipboard"}
    </Tooltip>
  );

  const handleSortChange = ({ sortBy, sortOrder }) => {
    setSortColumn(sortBy);
    setSortDirection(sortOrder === 'ASC' ? 'asc' : 'desc');
    fetchTransactions(
      { limit: 10, page: 1 },
      search,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder.toUpperCase()
    );
  };

  const column = [
    {
      id: '1',
      label: <div className="d-flex ps-3">Transaction ID</div>,
      value: 'transactionId',
      renderCell: (row) => (
        <div className="column-text ps-3">
          <div className='d-flex trans-id-text mw-100'>
            {row.id}
          </div>
          <OverlayTrigger placement="top" overlay={copyTooltip}>
            <button
              className="border-0 bg-transparent"
              onClick={() => handleCopyKey(row.id)}
            >
              Copy
            </button>
          </OverlayTrigger>
        </div>
      ),
    },
    {
      id: '2',
      label: 'Creation Date',
      value: 'createdDate',
      isSort: true,
      renderCell: (row) => (
        <div className="column-text date-time-container">
          <div className="date-text">
            {moment(row.createdAt).format('MMM DD, YYYY')}
          </div>
          <div className="time-text">
            {moment(row.createdAt).format('hh:mm:ss A')}
          </div>
        </div>
      ),
    },
    {
      id: '3',
      label: 'Last Update',
      value: 'lastUpdated',
      isSort: true,
      renderCell: (row) => (
        <div className="column-text date-time-container">
          <div className="date-text">
            {moment(row.updatedAt).format('MMM DD, YYYY')}
          </div>
          <div className="time-text">
            {moment(row.updatedAt).format('hh:mm:ss A')}
          </div>
        </div>
      ),
    },
    {
      id: '4',
      label: 'Payment Mode',
      value: 'paymentMode',
      renderCell: (row) => (
        <div className="column-text">
          {row.paymentType || '--'}
        </div>
      ),
    },
    {
      id: '5',
      label: 'Payment Gateway',
      value: 'paymentGateway',
      renderCell: (row) => (
        <div className="column-text">
          {row.providerName}
        </div>
      ),
    },
    {
      id: '6',
      label: 'Currency',
      value: 'currency',
      renderCell: (row) => (
        <div className="column-text">
          {row.currencyCode || '--'}
        </div>
      ),
    },
    {
      id: '7',
      label: 'Amount',
      value: 'amount',
      renderCell: (row) => (
        <div className="column-text">
          {row.amount}
        </div>
      ),
    },
    {
      id: '8',
      label: 'Status',
      value: 'status',
      renderCell: (row) => (
        <div className="column-text">
          <div className={`${
            row?.status.toLowerCase() === 'pending' ? 'pending' : 
            row?.status.toLowerCase() === 'success' ? 'success' : 'failed'
          }`}>
            {["active", "created", "new", "inprocess", "pending"].includes(row?.status) ? "PENDING" :
            row?.status?.toUpperCase()}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="main-transaction-container">
      {/* <CustomHeaderFilter
        isDownload
        isDateRange
        title="Transaction History"
        placeholder="Download"
        startDate={startDate}
        endDate={endDate}
        handleChange={handleDateChange}
        onDownload={handleDownload}
      /> */}
      <CustomTable
        data={transactionData}
        columns={column}
        totalCount={totalCount}
        fetchMore={fetchTransactions}
        onFilterChange={handleSortChange}
        noDataMessage='No Transaction Found'
        status={status}
        startDate={startDate}
        endDate={endDate}
      >
        <CustomTableFilter
          // isSearch
          // isStatus
          // searchPlaceholder="Search by Transaction ID."
          statusOptions={TransactionOption}
          handleFilterChange={handleSearch}
          onStatusChange={handleStatusChange}
        />
      </CustomTable>
    </div>
  );
};

export default Transaction;
