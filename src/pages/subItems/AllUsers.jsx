import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { IoCheckmarkSharp } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { FaEye } from "react-icons/fa6";
import {
  getAllUsersList,
  updateUser,
  updateUserRank,
} from "../../api/admin-api";
import PageLoader from "../../components/ui/PageLoader";
import { Routers } from "../../constants/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import SelectComponent from "../../components/SelectComponent";
import { formatDateonly } from "../../utils/dateFunctions";
import Swal from "sweetalert2";

const AllUsers = () => {
  const location = useLocation();
  const [userStatus, setUserStatus] = useState("all");
  const headers = [
    "#",
    "User ID",
    "Name",
    "Email",
    "Mobile",
    "Sponsor",
    "Active/Inactive",
    "Date",
  ];
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filterUserList, setFilterUserList] = useState([]);

  useEffect(() => {
    fetchUsersList();
  }, []);

  useEffect(() => {
    handleFilter(userStatus);
  }, [userStatus]);
  const fetchUsersList = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersList();
      if (response?.success) {
        setUserList(response?.data);
      }
      setUserStatus(location.state);
      setFilterUserList(response?.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatus = async (id, newstatus) => {
    try {
      setLoading(true);
      const response = await updateUser(id, { status: newstatus });
      if (response.success) {
        fetchUsersList();
        Swal.fire({
          title: "Success",
          text: newstatus ? "User Activated Successfully" : "User Deactivated ",
          icon: "success",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (isActive) => {
  setUserStatus(isActive);
  if (isActive === "Active") {
    const filterUsers = userList.filter((user) => user?.isActive === true);
    setFilterUserList(filterUsers);
  } else if (isActive === "In Active") {
    const filterUsers = userList.filter((user) => user?.isActive === false);
    setFilterUserList(filterUsers);
  } else {
    setFilterUserList(userList); // fallback if "all" or undefined
  }
};

  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white shadow-xl rounded-xl">
        {/* <div className="p-4">
          <SelectComponent
            label="Filter by Status"
            placeholder="Select status"
            value={userStatus}
            onChange={(e) => handleFilter(e.target.value)}
            options={["Active", "In Active"]}
          />
        </div> */}

        <TableComponent
          title="All Users"
          headers={headers}
          data={filterUserList}
          renderRow={(item, index) => (
            <tr
              key={item._id}
              className="border-b border-gray-300 text-center h-10"
            >
              <td className="...">{index + 1}</td>
                <td className="...">{item?.userId}</td>
              <td className="...">{item?.name}</td>
              <td className="...">{item?.email}</td>
              <td className="...">{item?.mobile}</td>
              <td className="...">
                {item?.sponsorReferralCode == null ||
                item?.sponsorReferralCode == ""
                  ? "Admin"
                  : `${item?.sponsorReferralCode}`}
              </td>
              <td className={`... font-bold ${item?.isActive == true ? "text-green-600 bg-green-300" : "text-red-600"}`}>
                {item?.isActive == true ? "Active" : "Inactive"}
              </td>
              <td className="...">{formatDateonly(item?.createdAt)}</td>
            </tr>
          )}
          searchKeys={["name", "userId"]}
          searchKey="Name and User ID"
        />
      </div>
    </>
  );
};

export default AllUsers;
