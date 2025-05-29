import React, { useState } from 'react';
import { IoIosEye } from "react-icons/io";
import TableComponent from '../components/TableComponent';
import { formatDateonly, formatDateTime } from '../utils/dateFunctions';

const RecentOrders = ({ orderList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5); 

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const title = "Recent Orders";
  const headers = [
    "S.No",
    "Order Number",
    "Name",
    "Email",
    "Payment Method",
    "Payment Status",
    "Order Status",
    "Purchase Date",
    "Total Amount",
  ];

  return (
    <div className="rounded-xl overflow-hidden space-y-5">
      <TableComponent
        showBackButton={false}
        showPagination={false}
        title={title}
        headers={headers}
        data={orderList}
        searchKey="orderNumber, userName, userEmail"
        searchKeys={["orderNumber", "userName", "userEmail"]}
        renderRow={(item, index) => (
  <tr key={item._id || index}>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{index + 1}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.orderNumber}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.userName}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.userEmail}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.paymentMethod}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.paymentStatus}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.orderStatus}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{formatDateTime(item?.createdAt)}</td>
    <td className='border-r border-b border-text-white/40 p-2 md:p-3'>₹{item?.totalAmount?.toFixed(2)}</td>
  </tr>
)}

      />
    </div>
  );
};

export default RecentOrders;
