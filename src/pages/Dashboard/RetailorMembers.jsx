import React from "react";
import { FaRegEye } from "react-icons/fa";
import Button from "../../components/Button";
import { Routers } from "../../constants/Routes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RetailorMembers = () => {
    const members = useSelector((state) => state.vendorData.vendorData);
    const navigate = useNavigate();
    const handleNavigateToVendorDetails = (member) => {
        navigate(`/vendor-details/${member._id}`, { state: member })
    }
    return (
        <div className="bg-white rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 justify-between">
                <h3 className="text-base font-semibold">
                All Users
                </h3>
                <Button title={"View All"} link={Routers.AllUsers} />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="flex justify-between items-center">
                            <th className="p-3  font-medium">Name</th>
                            <th className="p-3  font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {members?.data?.map((member, index) => (
                            <tr key={index} className="flex justify-between items-center">
                                <td className="p-3 font-light">
                                    {member?.name?.username}
                                </td>
                                <td className={`p-3 font-light`}>
                                    <button onClick={() => handleNavigateToVendorDetails(member)}
                                        className="p-2 rounded text-blue-950 bg-blue-950/10">
                                        <FaRegEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RetailorMembers;
