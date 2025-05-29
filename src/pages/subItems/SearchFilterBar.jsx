import React, { useState } from 'react';

const SearchFilterBar = ({ onSearch }) => {
  const [memberId, setMemberId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ memberId, fromDate, toDate });
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-6 bg-white shadow-xl rounded-xl">
      {/* Member ID Search */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Member ID :</label>
        <div className="flex">
          <input
            type="text"
            placeholder="Search Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-bg-color text-white px-4 rounded-r flex items-center"
          >
            <i className="fas fa-search mr-1" /> Search
          </button>
        </div>
      </div>

      {/* From Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">From Date :</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">To Date :</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded px-3 text-sm py-2 focus:outline-none"
        />
      </div>

      {/* Final Search Button */}
      <button
        onClick={handleSearch}
        className="bg-bg-color text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchFilterBar;
