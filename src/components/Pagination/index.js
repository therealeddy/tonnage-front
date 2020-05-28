import React from 'react';

import PropTypes from 'prop-types';

import { Container } from './styles';

export default function Pagination({
  currentPage,
  totalPosts,
  postsPerPage,
  setPaged,
}) {
  const pageNumbers = [];

  let cont = 0;
  let paged = 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (currentPage === 1) {
    paged = currentPage;
  } else if (currentPage === 2) {
    paged = 1;
  } else {
    paged = currentPage - 2;
  }

  for (let i = paged; i <= totalPages; i++) {
    if (cont < 5) {
      pageNumbers.push(i);
    }

    cont++;
  }

  return (
    <Container>
      {totalPosts > 0 && (
        <nav>
          <ul className="pagination">
            {currentPage !== 1 && (
              <li className="page-item">
                <button
                  className="page-link"
                  type="button"
                  onClick={() => setPaged(currentPage - 1)}
                >
                  &laquo;
                </button>
              </li>
            )}
            {pageNumbers.map((number) => (
              <li
                className={
                  number === currentPage ? 'active page-item' : 'page-item'
                }
                key={String(number)}
              >
                <button
                  className="page-link"
                  type="button"
                  onClick={() => setPaged(number)}
                >
                  {number}
                </button>
              </li>
            ))}
            {currentPage !== totalPages && (
              <li className="page-item">
                <button
                  className="page-link"
                  type="button"
                  onClick={() => setPaged(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </Container>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPosts: PropTypes.number,
  postsPerPage: PropTypes.number,
  setPaged: PropTypes.func,
};

Pagination.defaultProps = {
  currentPage: 1,
  totalPosts: 0,
  postsPerPage: 0,
  setPaged: () => {},
};
