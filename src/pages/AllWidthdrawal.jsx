import React, { useEffect, useState } from 'react';
import { getAllWithdrawals, withdrawalRequestStatus } from '../api/product-management-api';
import PageLoader from '../components/ui/PageLoader';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AllWidthdrawal = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [widthdrawalList, setWidthdrawalList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchWidthdrawalList = async () => {
            try {
                setIsLoading(true);
                const response = await getAllWithdrawals();
                setWidthdrawalList(response?.withdrawals);
            } catch (error) {
                console.error("Error fetching withdrawal list:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWidthdrawalList()
    }, [])


    const filteredData = widthdrawalList?.filter(
        (item) =>
            item?.user?.name
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item?.user?.email
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item._id.toLowerCase().includes(searchInput.toLowerCase())
    );

    const totalPages = Math.ceil(widthdrawalList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const handleStatusChange = async (id, newStatus) => {
        try {
            setIsLoading(true);
            await withdrawalRequestStatus(id, newStatus);
            setWidthdrawalList((prevList) =>
                prevList?.map((item) =>
                    item._id === id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
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
                            All Withdrawals
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
                                        Account Holder Name
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Bank Name
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Amount
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Account no.
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Ifsc Code
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Status
                                    </th>

                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Transaction id
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

                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.accountHolderName}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.bankName}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.amount}
                                            </td>
                                            <td
                                                className={`p-2 border border-gray-300 text-center`}
                                            >

                                                {item?.accountNumber}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.ifscCode}
                                            </td>
                                            
                                            <td className="border border-gray-300 p-2 text-center capitalize">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                                    className={`border rounded px-2 py-1 
            ${item.status === "Pending" ? "text-yellow-500" : ""}
            ${item.status === "Approved" ? "text-green-500" : ""}
            ${item.status === "Rejected" ? "text-red-500" : ""}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.transactionId || "N/A"}
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
        </>
    );
};

export default AllWidthdrawal;
