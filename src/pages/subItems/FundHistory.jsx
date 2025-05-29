import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TableComponent';
import { getFundHistory } from '../../api/admin-api';
import Swal from 'sweetalert2';
import PageLoader from '../../components/ui/PageLoader';
import { formatDateonly, formatDateTime } from '../../utils/dateFunctions';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';


const FundHistory = () => {
  const [filters, setFilters] = useState({
    memberId: '',
    fromDate: '',
    toDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);


  const debouncedSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 500),
    [filters]
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };

      debouncedSearch();
      return updatedFilters;
    });
  };


  const handleSearch = async () => {
    const queryParts = [];

    if (filters.memberId) {
      queryParts.push(`username=${filters.memberId}`);
    }
    if (filters.fromDate) {
      queryParts.push(`startDate=${filters.fromDate}`);
    }
    if (filters.toDate) {
      queryParts.push(`endDate=${filters.toDate}`);
    }

    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    try {
      const response = await getFundHistory(queryString);
      setData(response?.data);
    } catch (error) {
      console.log(error)
    }
  };
  const headers = ['#', ' Ref ID', 'Date', 'ID', 'Name', 'Fund', 'Status', 'Add/Ded.', "UTR", "Remark", "By"];
  useEffect(() => {
    fetchFundHistory();
  }, []);

  const fetchFundHistory = async () => {
    try {
      setLoading(true);
      const response = await getFundHistory();
      setData(response?.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (<PageLoader />)}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white shadow-xl rounded-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Member ID:</label>
          <div className="flex">
            <input
              type="text"
              name="memberId"
              value={filters.memberId}
              onChange={handleInputChange}
              placeholder="Search Member ID"
              className="w-full border border-gray-300 px-3 py-2 rounded-l-md text-sm focus:outline-none"
            />
            <button
              className="bg-bg-color text-white px-4 rounded-r-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From Date:</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Date:</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            className="w-full bg-bg-color text-white py-2 px-4 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-xl">
        <TableComponent
          title={"Fund History"}
          headers={headers}
          data={data}
          searchKey="Name"
          searchKeys={["userId.name", "userId.username", "TransactionId", "amount", "status", "remark"]}
          renderRow={(item, index) => (
            <>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{index + 1}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.TransactionId || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{formatDateTime(item?.createdAt) || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.userId?.username || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.userId?.name || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">₹ {item?.amount || "N/A"} </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3"> {item?.status == "Completed" ? "Success" : "Decline" || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.type == "DEBIT" ? "Deduct Fund" : "Add Fund" || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.utr || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {item?.remark
                  ? item.remark.split(" ").slice(0, 5).join(" ") + (item.remark.split(" ").length > 5 ? "..." : "")
                  : "N/A"}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.by || "N/A"}</td>

            </>
          )}
        />

      </div>
    </>

  );
};

export default FundHistory;
