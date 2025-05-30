import React, { useEffect, useState } from 'react';
import TableComponent from '../components/TableComponent';
import DownloadExcel from '../utils/DownloadExcel';
import { getIncomeHistory } from '../api/admin-api';
import PageLoader from '../components/ui/PageLoader';
import { formatDateonly } from '../utils/dateFunctions';

const headers = [
  '#',
  "Receiver's User ID",
  "Receiver's Name",
  'Type',
  "Sender's User ID",
  "Sender's Name",
  'Description',
  'Amount',
  'Date',
];

const renderRow = (item, index) => (
  <tr key={index}>
    <td className="border border-gray-300 p-2">{index + 1}</td>
    <td className="border border-gray-300 p-2">{item?.user?.userId}</td>
    <td className="border border-gray-300 p-2 capitalize">{item?.user?.name}</td>
    <td className="border border-gray-300 p-2 capitalize">{item?.type?.replace(/_/g, ' ')}</td>
    <td className="border border-gray-300 p-2">{item?.fromUser?.userId}</td>
    <td className="border border-gray-300 p-2 capitalize">{item?.fromUser?.name}</td>
    <td className="border border-gray-300 p-2">{item?.description}</td>
    <td className="border border-gray-300 p-2">{item?.amount}</td>
    <td className="border border-gray-300 p-2">{formatDateonly(item?.createdAt)}</td>
  </tr>
);

const IncomeHistory = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    const queryParts = [];
    if (filters.fromDate) queryParts.push(`startDate=${filters.fromDate}`);
    if (filters.toDate) queryParts.push(`endDate=${filters.toDate}`);

    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    try {
      setLoading(true);
      const response = await getIncomeHistory(queryString);
      console.log("Fetched income history:", response?.incomeHistory);
      setData(response?.incomeHistory || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getDefaultDateRange = () => {
      const today = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10);

      const format = (date) => date.toISOString().split('T')[0];

      return {
        fromDate: format(tenDaysAgo),
        toDate: format(today),
      };
    };

    const fetchDefaultIncomeHistory = async () => {
      const { fromDate, toDate } = getDefaultDateRange();
      setFilters({ fromDate, toDate });

      try {
        setLoading(true);
        const response = await getIncomeHistory(`?startDate=${fromDate}&endDate=${toDate}`);
        console.log("Fetched default income history:", response?.incomeHistory);
        setData(response?.incomeHistory || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultIncomeHistory();
  }, []);

  return (
    <>
      {loading && <PageLoader />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white shadow-xl rounded-xl">
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

      
        <div className="bg-white shadow-xl rounded-xl mt-5">
          <DownloadExcel data={data} />
          <TableComponent
            searchKey="User ID"
            searchKeys={["user.name", "user.userId", "fromUser.name", "fromUser.userId"]}
            title="Income History"
            headers={headers}
            data={data}
            renderRow={renderRow}
          />
        </div>
    </>
  );
};

export default IncomeHistory;
