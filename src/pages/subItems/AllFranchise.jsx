import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { getAllFranchiseList, updateUser } from "../../api/admin-api";
import PageLoader from "../../components/ui/PageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import SelectComponent from "../../components/SelectComponent";
import { formatDateonly } from "../../utils/dateFunctions";
import Swal from "sweetalert2";

const AllFranchise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filterUserList, setFilterUserList] = useState([]);

  const headers = [
    "#",
    "Date",
    "Name",
    "Email",
    "Mobile",
    "Address",
    "Total Income",
    "Total Self Investment",
    "Total Team Investment",
    "Sponsor",
    "Franchise ID",
    "Active/Inactive",
  ];

  const address = (item) =>
    [item?.location, item?.city, item?.state].filter(Boolean).join(", ");

  useEffect(() => {
    fetchFranchiseList();
  }, []);

  useEffect(() => {
    handleFilter(userStatus);
  }, [userStatus]);

  const fetchFranchiseList = async () => {
    try {
      setLoading(true);
      const response = await getAllFranchiseList();
      if (response?.success) {
        const data = response.data;
        setUserList(data);
        setFilterUserList(data);
        if (location.state) {
          setUserStatus(location.state);
        }
      }
    } catch (error) {
      console.error("Error fetching franchise list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatus = async (id, newstatus) => {
    try {
      setLoading(true);
      const response = await updateUser(id, { status: newstatus });
      if (response.success) {
        fetchFranchiseList();
        Swal.fire({
          title: "Success",
          text: newstatus ? "User Activated Successfully" : "User Deactivated",
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

  const handleFilter = (status) => {
    setUserStatus(status);
    if (status === "All") {
      setFilterUserList(userList);
    } else if (status === "Active") {
      const activeUsers = userList.filter((user) => user?.status === true);
      setFilterUserList(activeUsers);
    } else if (status === "In Active") {
      const inactiveUsers = userList.filter((user) => user?.status === false);
      setFilterUserList(inactiveUsers);
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
            options={["All", "Active", "In Active"]}
          />
        </div> */}

        <TableComponent
          title="All Franchise"
          headers={headers}
          data={filterUserList}
          renderRow={(item, index) => (
            <tr
              key={item._id}
              className="border-b border-gray-300 text-center h-10"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{formatDateonly(item?.createdAt)}</td>
              <td className="p-2">{item?.name}</td>
              <td className="p-2">{item?.email}</td>
              <td className="p-2">{item?.mobileNo}</td>
              <td className="p-2">{address(item)}</td>
              <td className="p-2">{Number(item?.totalIncome || 0).toFixed(2)}</td>
              <td className="p-2">{Number(item?.totalSelfInvestment || 0).toFixed(2)}</td>
              <td className="p-2">{Number(item?.totalTeamInvestment || 0).toFixed(2)}</td>
              <td className="p-2">
                {item?.sponsorReferralCode === null ||
                item?.sponsorReferralCode === ""
                  ? "Admin"
                  : item?.sponsorReferralCode}
              </td>
              <td className="p-2">{item?.franchiseId}</td>
              <td className="p-2">{item?.status === true ? "Active" : "Inactive"}</td>
            </tr>
          )}
          searchKeys={[
            "name",
            "franchiseId",
            "email",
            "mobile",
            "sponsorReferralCode",
          ]}
          searchKey="name or Franchise ID"
        />
      </div>
    </>
  );
};

export default AllFranchise;
