import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TableComponent';
import { getAllOrders, updateOrderStatus } from '../../api/admin-api';
import PageLoader from '../../components/ui/PageLoader';
import SelectComponent from '../../components/SelectComponent';
import { formatDateonly } from '../../utils/dateFunctions';
import { Link, useLocation } from 'react-router-dom';
import { Routers } from '../../constants/Routes';
import Swal from 'sweetalert2';


const TodayOrderHistory = () => {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [data, setData] = useState([]);
  const [filterOrderList, setfilterOrderList] = useState([]);
  const location = useLocation();
  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      const orders = response?.orders || [];

      setData(orders);
      setfilterOrderList(orders);

      const initialStatusMap = {};
      orders?.forEach(order => {
        initialStatusMap[order._id] = order.orderStatuses;
      });
      setStatusMap(initialStatusMap);

    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchOrderHistory();
  }, []);

  useEffect(() => {
  if (location?.state) {
    const today = location.state; // format: 'YYYY-MM-DD'

    const filtered = data.filter(order => {
      const orderDate = formatDateonly(order.createdAt); // formatDateonly should return 'YYYY-MM-DD'
      console.log(orderDate , today)
      return orderDate === today;
    });

    setfilterOrderList(filtered);
  }
}, [location?.state, data]);

  const headers = [
    '#', 'Order Id',  'FCID', 'Name', 'AMSD', 'GST', 'Shipping', 'Total', 'Date','Status', 'Action', "Invoice"
  ];

  const generateInvoicePath = (id) => Routers.Invoice.replace(':id', id);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      setStatusMap(prev => ({ ...prev, [orderId]: newStatus }));
      const response = await updateOrderStatus(orderId, newStatus);
      await fetchOrderHistory();
      if(response?.success){
            Swal.fire({
              title: 'Success',
              text: response?.message ,
              icon: 'success',
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              toast: true,
              timerProgressBar:true
            })
          }else{
             Swal.fire({
              title: 'error',
              text: response?.message ,
              icon: 'error',
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              toast: true,
              timerProgressBar:true
            })
          }
    } catch (error) {
      console.log(error)
       Swal.fire({
              title: 'error',
              text: response?.message ,
              icon: 'error',
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              toast: true,
              timerProgressBar:true
            })
          
    } finally {
      setLoading(false);
    }
  };


  const handleFilter = (status) => {
    setOrderStatus(status);

    if (status === 'All Orders') {
      return setfilterOrderList(data);
    }
    if (status == "Pending") {
      const filterOrders = data?.filter((order) => order?.orderStatuses === "Pending");
      setfilterOrderList(filterOrders);
    }
    if (status == "Proceed") {
      const filterOrders = data?.filter((order) => order?.orderStatuses === "Processing");
      setfilterOrderList(filterOrders);
    }
    if (status == "Cancel") {
      const filterOrders = data?.filter((order) => order?.orderStatuses === "Cancel");
      setfilterOrderList(filterOrders);
    }
    if (status == "Delivered") {
      const filterOrders = data?.filter((order) => order?.orderStatuses === "Delivered");
      setfilterOrderList(filterOrders);
    }
    if (status == "Dispatched") {
      const filterOrders = data?.filter((order) => order?.orderStatuses === "Dispatched");
      setfilterOrderList(filterOrders);
    }
  }
const getStatusStyle = (status) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Dispatched":
      return "bg-blue-100 text-blue-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

  const renderRow = (item, index) => (
    <>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3  text-blue-600 cursor-pointer">{index + 1}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.razorpayOrderId}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.userId?.username}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.userId?.name}</td>
      {/* <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{(item?.amount + item?.gstAmount).toFixed(2)}</td> */}
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.amount}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.gstAmount?.toFixed(2)}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.shippingAmount}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.totalAmount?.toFixed(2)}</td>
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{formatDateonly(item?.createdAt)}</td>
<td className={`border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3`}>
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(item?.orderStatuses)}`}
  >
    {item?.orderStatuses}
  </span>
</td> 
      <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">
        <SelectComponent
          name="orderStatus"
          value={statusMap[item._id] || ""}
          onChange={(e) => handleStatusChange(item._id, e.target.value)}
          options={[
            { label: "Proceed", value: "Processing" },
            { label: "Dispatched", value: "Dispatched" },
            { label: "Delivered", value: "Delivered" },
            { label: "Cancel", value: "Cancelled" }
          ]}
          classname="text-xs px-2 py-1 bg-white"
        />
      </td>
      <td className="border border-gray-300 p-2">
        <Link to={generateInvoicePath(item?._id)}>
          <button className="px-2 py-1 rounded-md font-light text-white bg-bg-color">Invoice</button>
        </Link>
      </td>
    </>
  );


  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white shadow-xl rounded-xl">
        <div className='p-4'>
          <SelectComponent
            label="Filter by Status"
            placeholder="Select status"
            value={orderStatus}
            onChange={(e) => handleFilter(e.target.value)}
            options={["All Orders", "Proceed", "Dispatched", "Delivered", "Cancel", "Pending"]}
          />
        </div>
        <TableComponent
          title="Order History"
          headers={headers}
          data={filterOrderList}
          renderRow={renderRow}
          searchKeys={['amount', 'userId.name', 'userId.username']}
          searchKey="name"
        />
      </div>
    </>

  );
};

export default TodayOrderHistory;
