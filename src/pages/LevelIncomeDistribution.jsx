import React, { useEffect, useState } from "react";
import { getLevelIncomeHistory } from "../api/product-management-api";

const LevelIncomeDistribution = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getLevelIncomeHistory().then((res) => setData(res?.levelIncome));
    }, []);

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Level Income Distribution
            </h2>

            {/* Table view for medium and larger screens */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3 font-medium">Level</th>
                            <th className="px-4 py-3 font-medium">Receiver User ID</th>
                            <th className="px-4 py-3 font-medium">Sender User ID</th>
                            <th className="px-4 py-3 font-medium">Order ID</th>
                            <th className="px-4 py-3 font-medium">Coupon</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{item?.level}</td>
                                <td className="px-4 py-2">{item?.user?._id}</td>
                                <td className="px-4 py-2">{item?.fromUser}</td>
                                <td className="px-4 py-2">{item?.order?._id}</td>
                                <td className="px-4 py-2">{item?.coupon?.code}</td>
                                <td className="px-4 py-2 text-green-600 font-medium">
                                    ${item?.amount}
                                </td>
                                <td className="px-4 py-2 text-gray-500">
                                    {new Date(item?.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {data?.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                    No level income data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card view for smaller screens */}
            <div className="md:hidden space-y-4">
                {data?.length === 0 && (
                    <div className="text-center text-gray-500">No level income data found.</div>
                )}
                {data?.map((item, index) => (
                    <div key={index} className="bg-white shadow rounded-lg p-4 text-sm">
                        <div><span className="font-semibold">Level:</span> {item?.level}</div>
                        <div><span className="font-semibold">Receiver User ID:</span> {item?.user?._id}</div>
                        <div><span className="font-semibold">Sender User ID:</span> {item?.fromUser}</div>
                        <div><span className="font-semibold">Order ID:</span> {item?.order?._id}</div>
                        <div><span className="font-semibold">Coupon:</span> {item?.coupon?.code}</div>
                        <div>
                            <span className="font-semibold">Amount:</span>{" "}
                            <span className="text-green-600 font-medium">${item?.amount}</span>
                        </div>
                        <div className="text-gray-500">
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(item?.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelIncomeDistribution;
 