import React, { useEffect, useState } from "react";
import PageLoader from "../components/ui/PageLoader";
import { getEpinVouchers, updateEpinStatus } from "../api/product-management-api";
import { FcApprove ,FcDisapprove } from "react-icons/fc";
import Swal from "sweetalert2";


const AllEpinVouchers = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [voucherList, setVoucherList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
   

    useEffect(() => {
        EmpinVouchers();
    }, []);

    const EmpinVouchers = async () => {
        try {
            setIsLoading(true);
            const response = await getEpinVouchers();
            setVoucherList(response?.epins);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const filteredData = voucherList?.filter(
        (item) =>
            item.name
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item.email
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item._id.toLowerCase().includes(searchInput.toLowerCase())
    );


    const totalPages = Math.ceil(voucherList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const handleApprove=async(id,status)=>{
        try {
            setIsLoading(true);
            await updateEpinStatus(id,!status);
            setVoucherList((prevList) =>
                prevList.map((item) =>
                    item._id === id
                        ? { ...item, isApproved: !status }
                        : item
                )
            );
            Swal.fire({
                icon: 'success',
                title: 'Epin Status Updated Successfully',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                showConfirmButton: false,
                timer: 1500
            })
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <>
            {isLoading && <PageLoader />}
            <div className="space-y-7">
                <div className="p-5 bg-white rounded-xl overflow-hidden space-y-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-gray-800">
                            All Epins Vouchers
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
                                        Username
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Mobile no.
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Email
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Amount
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Wallet Balance
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Total Orders
                                    </th>

                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Razorpay Order Id
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Razorpay Payment Id
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Used
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Code
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Action
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
                                            <td className="border border-gray-300 p-2 font-light text-start capitalize">
                                                {item?.purchasedBy?.name}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center">
                                                {item?.purchasedBy?.mobile}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.purchasedBy?.email}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.amount}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.purchasedBy?.epinWallet}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.purchasedBy?.orders?.length-1}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.razorpay_order_id}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.razorpayPaymentId}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                            {item?.isUsed ?<FcApprove size={24}/>:<FcDisapprove  size={24}/>}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.code}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                             <button onClick={()=>handleApprove(item?._id,item?.isApproved)}>{item?.isApproved ?<FcApprove size={24}/>:<FcDisapprove  size={24}/>}</button>   
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

export default AllEpinVouchers;
