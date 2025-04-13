'use client';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, limit, onPageChange, loading }: PaginationProps) {


  const handlePageChange = (page: number) => {
    
    if (page < 1 || page > totalPages) return; // Prevent invalid page navigation
    onPageChange(page);
  };

  return (
    <div className='pagination'>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className='paginationButton'
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className='paginationButton'
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;