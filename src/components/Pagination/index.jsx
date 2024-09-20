import React, { useEffect, useState } from 'react';
import './Pagination.css';
// import { LeftArrowIcon, RightArrowIcon } from '../../assets/svg';

const Pagination = (props) => {
  const { totalPages, activePage, onClick } = props;
  const [selectPage, setSelectPage] = useState(activePage);

  useEffect(() => {
    setSelectPage(activePage);
  }, [activePage]);

  const handleSelectPageOnClickEvent = (page) => {
    if (onClick) {
      onClick(page);
    }
  };

  const onArrowClick = (operator) => () => {
    if (operator === '-' && selectPage === 1) return;
    if (operator === '+' && selectPage === totalPages) return;
    handleSelectPageOnClickEvent(operator === '-' ? selectPage - 1 : selectPage + 1);
  };

  const renderPageNumbersWithEllipses = () => {
    const numberResponse = [];
    if (totalPages < 3) {
      return Array.from(Array(totalPages).keys()).map((v) => v + 1);
    }
    numberResponse.push(1);
    if (selectPage > 3) {
      numberResponse.push('...');
    }
    for (let i = Math.max(2, selectPage - 1); i <= Math.min(totalPages - 1, selectPage + 1); i++) {
      numberResponse.push(i);
    }
    if (selectPage < totalPages - 2) {
      numberResponse.push('...');
    }
    numberResponse.push(totalPages);
    return numberResponse;
  };

  return (
    <ul className="pagination">
      <li className={`page-item ${selectPage === 1 ? '' : ''}`} onClick={onArrowClick('-')}>
        <button className="page-link" aria-label="Previous">
          <span aria-hidden="true">
            {'<'}
            {/* <LeftArrowIcon stroke={`${selectPage === 1 ? '#A0A0A0' : '#4B5065'}`} /> */}
          </span>
        </button>
      </li>
      {
        renderPageNumbersWithEllipses().map((page, index) => {
          if (page === '...') {
            return (
              <li className={`page-item ${Number(page) === selectPage ? 'active' : ''}`} key={index}>
                <span className="page-link">{page}</span>
              </li>
            );
          }
          return (
            <li className={`page-item ${Number(page) === selectPage ? 'active' : ''}`}
              onClick={() => handleSelectPageOnClickEvent(Number(page))} key={index}>
              <span className="page-link">{page}</span>
            </li>
          );
        })
      }
      <li className="page-item" onClick={onArrowClick('+')}>
        <button aria-label="Next" className='page-link'>
          <span aria-hidden="true">
            {/* <RightArrowIcon stroke={`${selectPage === totalPages ? '#A0A0A0' : '#4B5065'}`} /> */}
            {'>'}
          </span>
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
