import React, { useEffect, useState, useCallback } from "react";
import TableComponent from "../../components/TableComponent";
import {
  getwithdrawalRequestHistory,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} from "../../api/admin-api";
import { formatDateTime } from "../../utils/dateFunctions";
import debounce from "lodash.debounce";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { MdDoNotDisturb } from "react-icons/md";
import { FcAcceptDatabase } from "react-icons/fc";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";

const WithdrawalRequest = () => {
  const headers = [
    "#",
    "Request ID",
    "Name",
    "Date",
    "Amount",
    "Status",
    "Action",
  ];

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    requestId: "",
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
    const queryString = filters.userId ? `?username=${filters.userId}` : "";

    try {
      const response = await getwithdrawalRequestHistory(queryString);
      setData(response?.data?.withdrawals || []);
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
      const response = await getwithdrawalRequestHistory();
      setData(response?.data?.withdrawals || []);
    } catch (error) {
      console.error("Error fetching fund request history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const { value: adminRemarks } = await Swal.fire({
      title: "Approve Withdrawal Request",
      input: "text",
      inputLabel: "Admin Remarks",
      inputPlaceholder: "Enter remarks (optional)",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (adminRemarks === undefined) return;

    try {
      setLoading(true);
      const response = await approveWithdrawalRequest(id, { adminRemarks });

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
      toast.success(response?.message || "Withdrawal request approved.");
      fetchRequestFundHistory();
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
      const response = await rejectWithdrawalRequest(id, formValues);

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
      toast.success(response?.message || "Withdrawal request rejected.");
      fetchRequestFundHistory();
    } catch (error) {
      Swal.fire("Error", "Failed to reject request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white shadow-xl rounded-xl">
        User ID filter
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Request ID:</label>
          <div className="flex">
            <input
              type="text"
              name="requestId"
              value={filters.requestId}
              onChange={handleInputChange}
              placeholder="Search User ID"
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
      </div> */}

      <div className="bg-white shadow-xl rounded-xl">
        <TableComponent
          title="Withdrawal Request"
          headers={headers}
          data={data}
          searchKey="Request ID, Amount, Status"
          searchKeys={["requestedId", "amount", "status"]}
          renderRow={(item, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item?.requestedId || "N/A"}</td>
              <td className="border p-2">{item?.userId?.name || "N/A"}</td>
              <td className="border p-2">{formatDateTime(item?.requestedAt)}</td>
              <td className="border p-2">{item?.amount}</td>
              <td className="border p-2">{item?.status}</td>
              <td className="border p-2 flex gap-2">
                <ButtonWithIcon
                  title="Accept"
                  icon={<FcAcceptDatabase />}
                  bgcolor="bg-green-600"
                  onClick={() => handleApprove(item._id)}
                  disabled={["approved", "rejected"].includes(item.status.toLowerCase())}
                />
                <ButtonWithIcon
                  title="Decline"
                  icon={<MdDoNotDisturb />}
                  bgcolor="bg-red-600"
                  onClick={() => handleReject(item._id)}
                  disabled={["approved", "rejected"].includes(item.status.toLowerCase())}
                />
              </td>
            </tr>
          )}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Payment Proof"
      >
        <img
          src={paymentProof}
          alt="Payment Proof"
          className="w-full h-full object-contain"
        />
      </Modal>
    </>
  );
};

export default WithdrawalRequest;
