import React, { useEffect, useState, useCallback } from "react";
import TableComponent from "../../components/TableComponent";
import {
  getFundRequestHistory,
  approveFundRequest,
  rejectFundRequest,
} from "../../api/admin-api";
import { formatDateTime } from "../../utils/dateFunctions";
import debounce from "lodash.debounce";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { MdDoNotDisturb } from "react-icons/md";
import { FcAcceptDatabase } from "react-icons/fc";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import Modal from "../../components/Modal";
import { FaEye } from "react-icons/fa6";

const FundRequest = () => {
  const headers = [
    "#",
    "User ID",
    "Date",
    "Amount",
    "Status",
    "Transaction ID",
    "UTR Number",
    "Payment Proof",
    "Action",
  ];

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    memberId: "",
    fromDate: "",
    toDate: "",
  });

  const [data, setData] = useState([]);
  const [paymentProof, setPaymentProof] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 500),
    [filters]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      debouncedSearch();
      return updatedFilters;
    });
  };

  const handleSearch = async () => {
    const queryParts = [];

    if (filters.memberId) queryParts.push(`username=${filters.memberId}`);
    if (filters.fromDate) queryParts.push(`startDate=${filters.fromDate}`);
    if (filters.toDate) queryParts.push(`endDate=${filters.toDate}`);

    const queryString = queryParts.length ? `?${queryParts.join("&")}` : "";

    try {
      const response = await getFundRequestHistory(queryString);
      setData(response?.data?.requests || []);
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  useEffect(() => {
    fetchRequestFundHistory();
  }, []);

  const fetchRequestFundHistory = async () => {
    try {
      setLoading(true);
      const response = await getFundRequestHistory();
      setData(response?.data?.requests || []);
    } catch (error) {
      console.error("Error fetching fund request history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const { value: adminRemarks } = await Swal.fire({
      title: "Approve Fund Request",
      input: "text",
      inputLabel: "Admin Remarks",
      inputPlaceholder: "Enter remarks (optional)",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (!adminRemarks && adminRemarks !== "") return;

    try {
      setLoading(true);
      const response = await approveFundRequest(id, { adminRemarks });

      if (response?.success) {
        setData((prev) => prev.filter((d) => d._id !== id));
        Swal.fire({
          title: "Approved!",
          text: response.message,
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to approve request.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    const { value: formValues } = await Swal.fire({
      title: "Reject Fund Request",
      html:
        `<input id="rejectionReason" class="swal2-input" placeholder="Rejection reason" required>` +
        `<input id="adminRemarks" class="swal2-input" placeholder="Admin remarks (optional)">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Reject",
      preConfirm: () => {
        const rejectionReason =
          document.getElementById("rejectionReason").value;
        const adminRemarks = document.getElementById("adminRemarks").value;

        if (!rejectionReason) {
          Swal.showValidationMessage("Rejection reason is required");
          return;
        }

        return { rejectionReason, adminRemarks };
      },
    });

    if (!formValues) return;

    try {
      setLoading(true);
      const response = await rejectFundRequest(id, formValues);

      if (response?.success) {
        setData((prev) => prev.filter((d) => d._id !== id));
        Swal.fire({
          title: "Rejected!",
          text: response.message,
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to reject request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white shadow-xl rounded-xl">
        {/* filters */}
        <div>
          <label className="block text-sm font-medium mb-1">Member ID:</label>
          <div className="flex">
            <input
              type="text"
              name="memberId"
              value={filters.memberId}
              onChange={handleInputChange}
              placeholder="Search Member ID"
              className="w-full border border-gray-300 px-3 py-2 rounded-l-md text-sm focus:outline-none"
            />
            <button
              className="bg-bg-color text-white px-4 rounded-r-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From Date:</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Date:</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            className="w-full bg-bg-color text-white py-2 px-4 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl">
        <TableComponent
          title="Fund Request"
          headers={headers}
          data={data}
          searchKey="Member ID, Amount, Status"
          searchKeys={["userId.username", "requestedAmount", "status"]}
          renderRow={(item, index) => (
            <>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {index + 1}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {item?.userId?.userId || "N/A"}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {formatDateTime(item?.createdAt)}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {item?.requestedAmount}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {item?.status}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {item?.transactionId}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                {item?.utr}
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                <div className="flex gap-4 items-center">
                  <img
                    src={item?.paymentProof}
                    alt=""
                    className="w-10 h-10 object-cover rounded"
                  />
                  <FaEye
                    className="text-2xl cursor-pointer"
                    onClick={() => {
                      setIsModalOpen(true);
                      setPaymentProof(item?.paymentProof);
                    }}
                  />
                </div>
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3 flex gap-2">
                <ButtonWithIcon
                  title="Accept"
                  icon={<FcAcceptDatabase />}
                  bgcolor="bg-green-600"
                  onClick={() => handleApprove(item._id)}
                  disabled={["approved", "rejected"].includes(
                    item.status.toLowerCase()
                  )}
                />
                <ButtonWithIcon
                  title="Decline"
                  icon={<MdDoNotDisturb />}
                  bgcolor="bg-red-600"
                  onClick={() => handleReject(item._id)}
                  disabled={["approved", "rejected"].includes(
                    item.status.toLowerCase()
                  )}
                />
              </td>
            </>
          )}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Payment Proof"
        children={
          <img
            src={paymentProof}
            alt="Payment Proof"
            className="w-full h-full object-contain"
          />
        }
      />
    </>
  );
};

export default FundRequest;
