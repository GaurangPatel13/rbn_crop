import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import PageLoader from "../components/ui/PageLoader";
import { getAllOrders, getAllUsers, updateOrderStatus } from "../api/product-management-api";
import { CgArrowsExchangeV } from "react-icons/cg";
import Swal from "sweetalert2";
import { set } from "react-hook-form";
import { IoIosEye } from "react-icons/io";

const AllOrders = ({ tittle }) => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [orderList, setOrderList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPopUp, setShowPopUp] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            setIsLoading(true);
            const response = await getAllOrders();
            setOrderList(response?.orders.reverse());
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const filteredData = orderList?.filter(
        (item) =>
            item?.user?.name
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item?.user?.email
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item._id.toLowerCase().includes(searchInput.toLowerCase())
    );



    const totalPages = Math.ceil(orderList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const handleStatusChange = async (id, newStatus) => {
        try {
            setIsLoading(true);
            await updateOrderStatus(id, newStatus);
            Swal.fire({
                icon: "success",
                title: "Order Status Updated Successfully",
                showConfirmButton: false,
                timer: 1500
            })
            getOrderList();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            {isLoading && <PageLoader />}
            <div className="space-y-7">
                <div className="p-5 bg-white rounded-xl overflow-hidden space-y-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-gray-800">
                            All Orders
                        </h2>
                        <div className="">
                            <input
                                type="text"
                                placeholder="Search User"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                            <thead>
                                <tr className="">
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        SL
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Order ID
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        User Name
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Status
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Total
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Items
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        View Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? paginatedData.map((_, index) => (
                                        <tr
                                            key={index}
                                            className="animate-pulse"
                                        >
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-4 bg-gray-300 rounded w-6 mx-auto"></div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <div className="h-6 bg-gray-300 rounded w-16 mx-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                    : paginatedData.map((item, index) => (
                                        <tr key={index} className="">
                                            <td className="border border-gray-300 p-2 font-light text-center">
                                                {(currentPage - 1) *
                                                    rowsPerPage +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-start capitalize">
                                                {item?.orderId}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center">
                                                {item?.user?.name}
                                            </td>

                                            <td className="border border-gray-300 p-2 text-center capitalize">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                                    className={`border rounded px-2 py-1 ${item.status === "Shipped"
                                                            ? "text-yellow-500"
                                                            : item.status === "Delivered"
                                                                ? "text-green-500"
                                                                : item.status === "Refunded"
                                                                    ? "text-blue-500"
                                                                    : "text-red-500"
                                                        }`}
                                                >
                                                 
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="Refunded">Refunded</option>
                                                    <option value="Ready for Pickup">Ready for Pickup</option>
                                                </select>
                                            </td>

                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.totalAmount}
                                            </td>
                                            <td
                                                className={`p-2 border border-gray-300 text-center`}
                                            >
                                                <div className="flex gap-2 items-center justify-center">

                                                    <p>{item?.items?.length}</p>
                                                </div>
                                            </td>
                                            <td
                                                className={`p-2 border border-gray-300 text-center`}
                                            >
                                                <div className="flex gap-2 items-center justify-center">
                                                    <div className='p-2 bg-bg-color rounded-md text-white cursor-pointer'
                                                        onClick={() => {
                                                            setSelectedProduct(item);
                                                            setShowPopUp(true);
                                                            console.log(item)
                                                        }}
                                                    >
                                                        <IoIosEye />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center ">
                        <span className="text-gray-600">
                            Rows per page: {rowsPerPage}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-2 py-1 border rounded ${currentPage === i + 1
                                            ? "bg-bg-color text-white"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPopUp && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setShowPopUp(false)} // clicking outside also closes
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
                        <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
                        <div className="space-y-3 text-gray-700">
                            <p><span className="font-semibold">Order ID:</span> {selectedProduct.orderId}</p>
                            <p><span className="font-semibold">User Name:</span> {selectedProduct?.user?.name}</p>
                            <p><span className="font-semibold">User Email:</span> {selectedProduct?.user?.email}</p>
                            <p><span className="font-semibold">User Mobile:</span> {selectedProduct?.user?.mobile}</p>
                            <p><span className="font-semibold">Total Amount:</span> ₹ {selectedProduct?.totalAmount}</p>
                            <p><span className="font-semibold">Status:</span> {selectedProduct?.status}</p>
                            <p><span className="font-semibold">Address:</span> {selectedProduct?.address?.addressLine1},{selectedProduct?.address?.addressLine2}, {selectedProduct?.address?.city}, {selectedProduct?.address?.state},{selectedProduct?.address?.country}, {selectedProduct?.address?.pincode} </p>
                            <p><span className="font-semibold">Items:</span></p>
                            <ul className="list-disc pl-5">
                                {selectedProduct?.items?.map((item, index) => (
                                    <li key={index} className="text-sm flex items-center gap-5 border-b border-gray-200 py-2">
                                        <p className="mr-2">{index + 1}</p>
                                        <img
                                            src={item?.product?.images?.[0]}
                                            alt={item?.product?.productName}
                                            className="w-auto h-10 object-cover rounded"
                                        />
                                        {item?.product?.name}
                                        <span className="text-gray-500">
                                            {item?.product?.price} x {item?.quantity}
                                        </span>
                                        <span className="text-gray-500">
                                            {item?.quantity} pcs
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => setShowPopUp(false)}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllOrders;
