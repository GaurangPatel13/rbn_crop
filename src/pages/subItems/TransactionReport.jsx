import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import DownloadExcel from "../../utils/DownloadExcel";
import { getFundHistory } from "../../api/admin-api";
import PageLoader from "../../components/ui/PageLoader";
import { formatDateonly } from "../../utils/dateFunctions";

const headers = [
  "#",
  "Txn ID",
  "User ID",
  "Name",
  "Total Amount",
  "Type",
  "Status",
  "Date",
];

const renderRow = (item, index) => (
  <tr key={index}>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
      {index + 1}
    </td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
      {item?.transactionId}
    </td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
      {item?.userId?.userId}
    </td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3 uppercase">
      {item?.userId?.name}
    </td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
      {item?.amount}
    </td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
      {item?.type}
    </td>
    <td
      className={`border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3 ${
        {
          completed: "text-green-600 bg-green-200",
          failed: "text-red-600 bg-red-200",
          pending: "text-yellow-600 bg-yellow-200",
        }[item?.status] || ""
      }`}
    >
      {item?.status}
    </td>

    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
      {formatDateonly(item?.createdAt)}
    </td>
  </tr>
);

const TransactionReport = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
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

    const queryString = queryParts.length ? `?${queryParts.join("&")}` : "";
    try {
      setLoading(true);
      const response = await getFundHistory(queryString);
      setData(response?.transactions || []);
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

      const format = (date) => date.toISOString().split("T")[0];

      return {
        fromDate: format(tenDaysAgo),
        toDate: format(today),
      };
    };

    const fetchDefaultTransactions = async () => {
      const { fromDate, toDate } = getDefaultDateRange();
      setFilters({ fromDate, toDate });

      try {
        setLoading(true);
        const response = await getFundHistory(
          `?startDate=${fromDate}&endDate=${toDate}`
        );
        setData(response?.transactions || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultTransactions();
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

      {data?.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl mt-5">
          <DownloadExcel data={data} />
          <TableComponent
            searchKey="Search by Txn ID, User ID, or Name"
            searchKeys={["transactionId", "userId.userId", "userId.name"]}
            title="Transactional Summary"
            headers={headers}
            data={data}
            renderRow={renderRow}
          />
        </div>
      )}
    </>
  );
};

export default TransactionReport;
