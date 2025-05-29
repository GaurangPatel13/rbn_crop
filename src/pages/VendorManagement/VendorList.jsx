import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import { getAllUsers, updateWithdrawStatus } from "../../api/product-management-api";
import { FcApprove, FcDisapprove } from "react-icons/fc";

const VendorList = ({ tittle }) => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [sellerList, setSellerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        getSellerList();
    }, []);

    const getSellerList = async () => {
        try {
            setIsLoading(true);
            const response = await getAllUsers();
            setSellerList(response?.users);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const filteredData = sellerList?.filter(
        (item) =>
            item.name?.username
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item.shopdetails?.shopname
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            item._id.toLowerCase().includes(searchInput.toLowerCase())
    );


    const totalPages = Math.ceil(sellerList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    );

   const handleApprove=async(id,status)=>{
           try {
               setIsLoading(true);
               await updateWithdrawStatus(id,!status);
               setSellerList((prevList) =>
                   prevList.map((item) =>
                       item._id === id
                           ? { ...item, isWithdrawalRequest: !status }
                           : item
                   )
               );
               Swal.fire({
                   icon: 'success',
                   title: 'Withdrawal Status Updated Successfully',
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
                            {tittle}
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
                                        Status
                                    </th>
                                    <th className="border border-gray-300 font-medium p-2 text-center">
                                        Withdraw Permission
                                    </th>
                                    {/* <th className="border border-gray-300 font-medium p-2 text-center">
                                    Action
                                    </th> */}
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
                                                {item?.name}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center">
                                                {item?.mobile}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                                {item?.email}
                                            </td>


                                            <td
                                                className={`p-2 border border-gray-300 text-center`}
                                            >
                                                <div className="flex gap-2 items-center justify-center">

                                                    <p
                                                        className="p-2 rounded text-bg-color bg-bg-color/10"
                                                    >
                                                        {item?.isActive ? "Active" : "Inactive"}
                                                    </p>

                                                </div>
                                            </td>

                                            <td className="border border-gray-300 p-2 font-light text-center capitalize">
                                            
                                                <button onClick={() => handleApprove(item?._id, item?.isWithdrawalRequest)}>{item?.isWithdrawalRequest ? <FcApprove size={24} /> : <FcDisapprove size={24} />}</button>

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

export default VendorList;
