import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { getAllOrders, updateOrderStatus } from "../../api/admin-api";
import PageLoader from "../../components/ui/PageLoader";
import SelectComponent from "../../components/SelectComponent";
import { formatDateonly } from "../../utils/dateFunctions";
import { Link, useLocation } from "react-router-dom";
import { Routers } from "../../constants/Routes";
import Swal from "sweetalert2";
import { FaPencil } from "react-icons/fa6";

const OrderHistory = () => {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [data, setData] = useState([]);
  const [filterOrderList, setfilterOrderList] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      const orders = response?.orders || [];
      setData(orders);
      setfilterOrderList(orders);

      const initialStatusMap = {};
      orders?.forEach((order) => {
        initialStatusMap[order._id] = order.orderStatuses;
      });
      setStatusMap(initialStatusMap);
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const headers = [
    "#",
    "Name",
    "Mobile",
    "Email",
    "Purchase Method",
    "Purchase Status",
    "Total Amount",
    "Products",
    "Order Status",
    "Order Number",
    "Address",
    "Created At",
    "Action",
  ];

  const generateInvoicePath = (id) => Routers.Invoice.replace(":id", id);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));
      const response = await updateOrderStatus(orderId, newStatus);
      await fetchOrderHistory();
      if (response?.success) {
        Swal.fire({
          title: "Success",
          text: response?.message,
          icon: "success",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response?.message,
          icon: "error",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          timerProgressBar: true,
        });
      }
      setEditingOrderId(null); // Reset edit mode after success
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (status) => {
    setOrderStatus(status);

    if (status === "All Orders") {
      return setfilterOrderList(data);
    }
    if (status == "Pending") {
      const filterOrders = data?.filter(
        (order) => order?.orderStatuses === "Pending"
      );
      setfilterOrderList(filterOrders);
    }
    if (status == "Proceed") {
      const filterOrders = data?.filter(
        (order) => order?.orderStatuses === "Processing"
      );
      setfilterOrderList(filterOrders);
    }
    if (status == "Cancel") {
      const filterOrders = data?.filter(
        (order) => order?.orderStatuses === "Cancel"
      );
      setfilterOrderList(filterOrders);
    }
    if (status == "Delivered") {
      const filterOrders = data?.filter(
        (order) => order?.orderStatuses === "Delivered"
      );
      setfilterOrderList(filterOrders);
    }
    if (status == "Dispatched") {
      const filterOrders = data?.filter(
        (order) => order?.orderStatuses === "Dispatched"
      );
      setfilterOrderList(filterOrders);
    }
  };
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

  const handleStatusChange1 = (orderId) => {
    setEditingOrderId(orderId);
  };

  const renderRow = (item, index) => {
    const productList = item.items
      ?.map((i) => `${i.product?.name} x${i.quantity}`)
      .join(", ");

    return (
      <tr key={item._id}>
        {console.log(item?.orderStatus)}
        <td className="p-2">{index + 1}</td>
        <td className="p-2">{item.address?.fullName}</td>
        <td className="p-2">{item.address?.phoneNumber}</td>
        <td className="p-2">{item.userId?.email}</td>
        <td className="p-2">{item.paymentMethod}</td>
        <td className="p-2">{item.paymentStatus}</td>
        <td className="p-2">{item.totalAmount?.toFixed(2)}</td>
        <td className="p-2">{productList}</td>
        <td className="p-2 flex items-center gap-1">
          {editingOrderId === item._id ? (
            <SelectComponent
              name="orderStatus"
              value={statusMap[item._id] || item?.orderStatus}
              onChange={(e) => handleStatusChange(item._id, e.target.value)}
              options={[
                { name: "Processing", value: "Processing" },
                { name: "Shipped", value: "Shipped" },
                { name: "Delivered", value: "Delivered" },
                { name: "Cancelled", value: "Cancelled" },
              ]}
              classname="text-xs px-2 py-1 bg-white"
            />
          ) : (
            <>
              <span
                className={`p-2 text-xs rounded-full ${getStatusStyle(
                  item?.orderStatus
                )}`}
              >
                {item?.orderStatus}
              </span>
              <button
                className="bg-red-200 rounded-full p-2 text-base text-red-500"
                onClick={() => handleStatusChange1(item._id)}
              >
                <FaPencil />
              </button>
            </>
          )}
        </td>
        <td className="p-2">{item.orderNumber}</td>
        <td className="p-2">
          {item.address?.city}, {item.address?.country}
        </td>
        <td className="p-2">{formatDateonly(item.createdAt)}</td>
        <td className="p-2">
          <Link to={generateInvoicePath(item._id)}>
            <button className="px-2 py-1 rounded-md font-light text-white bg-bg-color">
              Invoice
            </button>
          </Link>
        </td>
      </tr>
    );
  };

  const totalAmount = filterOrderList?.reduce(
    (sum, item) => sum + Number(item?.totalAmount || 0),
    0
  );
  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white shadow-xl rounded-xl">
        <div className="p-4">
          <SelectComponent
            label="Filter by Status"
            placeholder="Select status"
            value={orderStatus}
            onChange={(e) => handleFilter(e.target.value)}
            options={[
              "All Orders",
              "Proceed",
              "Dispatched",
              "Delivered",
              "Cancel",
              "Pending",
            ]}
          />
        </div>
        <TableComponent
          title="Order History"
          headers={headers}
          data={filterOrderList}
          renderRow={renderRow}
          searchKeys={["amount", "userId.name", "userId.username"]}
          searchKey="name"
          footer={
            <tr className="bg-gray-100 font-semibold">
              <td colSpan={6}></td>
              <td className="p-2 border-t border-gray-300">
                {totalAmount?.toFixed(2)}
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          }
        />
      </div>
    </>
  );
};

export default OrderHistory;
