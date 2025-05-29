import React from 'react';
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const handlePageClick = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
        }
    };
    const renderPages = () => {
        const pages = [];
        pages.push(1);
        if (currentPage > 4) {
            pages.push('...');
        }
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }
        if (currentPage < totalPages - 3) {
            pages.push('...');
        }
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        return pages;
    };
    return (
        <div className='flex justify-center items-center space-x-2 my-4'>
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className='w-8 h-8 rounded-md border bg-[#ffffff13] backdrop-blur-md text-black'
            >
                &lt;
            </button>
            {renderPages().map((item, index) => (
                <button
                    key={index}
                    onClick={() => typeof item === 'number' && handlePageClick(item)}
                    disabled={item === '...'}
                    className={`w-8 h-8 rounded-md border ${item === currentPage ? 'bg-bg-color backdrop-blur-md text-white' : 'bg-white/10 text-black'
                        }`}
                >
                    {item}
                </button>
            ))}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='w-8 h-8 rounded-md border bg-[#ffffff13] backdrop-blur-md text-black'
            >
                &gt;
            </button>
        </div>
    );
};
export default Pagination;