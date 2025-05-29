// DynamicTable.jsx
import React, { useState } from 'react';

const DynamicTable = ({ columns, data, itemsPerPage = 10, title = "" }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data by search (basic case-insensitive match)
  const filteredData = data.filter(row =>
    Object.values(row).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChangePage = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md overflow-x-auto">
      {title && (
        <div className="flex items-center gap-2 font-semibold text-lg mb-4">
          <span>👥</span>
          <span>{title}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div>
          Show
          <select className="mx-2 p-1 border rounded" value={itemsPerPage} disabled>
            <option value={itemsPerPage}>{itemsPerPage}</option>
          </select>
          entries
        </div>
        <div>
          Search:
          <input
            type="text"
            className="ml-2 border p-1 rounded"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="border px-3 py-2 text-left font-semibold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                No data found.
              </td>
            </tr>
          ) : (
            paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col, cidx) => (
                  <td key={cidx} className="border px-3 py-2">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {paginatedData.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {(currentPage - 1) * itemsPerPage + paginatedData.length} of {filteredData.length} entries
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleChangePage('prev')}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 border rounded bg-blue-600 text-white">{currentPage}</span>
          <button
            onClick={() => handleChangePage('next')}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
