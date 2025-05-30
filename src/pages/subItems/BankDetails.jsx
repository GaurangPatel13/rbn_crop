/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import PageLoader from "../../components/ui/PageLoader";
import { addBankDetails } from "../../api/admin-api";

const BankDetails = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [payload, setPayload] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    upiId: "",
    qrCodeImage: null,
  });

  const validateForm = () => {
    const { bankName, accountName, accountNumber, ifscCode, branch, upiId, qrCodeImage } = payload;

    if (!bankName || !accountName || !accountNumber || !ifscCode || !branch || !upiId || !qrCodeImage) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields and upload the QR Code.",
      });
      return false;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(accountName)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Account Name",
        text: "Account Name must have at least 2 letters and no numbers.",
      });
      return false;
    }

    if (!/^\d{10,}$/.test(accountNumber)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Account Number",
        text: "Account Number must be at least 10 digits and only numbers.",
      });
      return false;
    }

    if (!/^[\w.\-]+@[\w.\-]+$/.test(upiId)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid UPI ID",
        text: "Please enter a valid UPI ID (e.g., name@bank).",
      });
      return false;
    }

    return true;
  };

  const handleIfscLookup = async (code) => {
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${code}`);
      if (!res.ok) throw new Error("Invalid IFSC");

      const data = await res.json();
      console.log("IFSC lookup response:", data);

      setPayload((prev) => ({
        ...prev,
        bankName: data.BANK || "",
        branch: data.BRANCH || "",
      }));
    } catch (err) {
      console.error("IFSC lookup failed", err);
      Swal.fire({
        icon: "error",
        title: "Invalid IFSC Code",
        text: "Unable to fetch bank details. Please check the code.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await addBankDetails(formData);

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result?.message || "Bank details saved successfully",
        });
        handleReset();
        onClose?.();
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: result?.message || "Check all fields and try again.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPayload({
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      upiId: "",
      qrCodeImage: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-5 bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Account Name"
            value={payload.accountName}
            onChange={(e) => setPayload({ ...payload, accountName: e.target.value })}
          />

          <InputField
            label="Account Number"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            onWheel={(e) => e.target.blur()}
            value={payload.accountNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPayload({ ...payload, accountNumber: val });
            }}
          />

          <InputField
            label="IFSC Code"
            value={payload.ifscCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setPayload({ ...payload, ifscCode: val });
              if (val.length === 11) handleIfscLookup(val);
            }}
          />
          <InputField
            label="Bank Name"
            value={payload.bankName}
            disabled
            onChange={(e) => setPayload({ ...payload, bankName: e.target.value })}
          />

          <InputField
            label="Branch"
            value={payload.branch}
            disabled
            onChange={(e) => setPayload({ ...payload, branch: e.target.value })}
          />

          <InputField
            label="UPI ID"
            value={payload.upiId}
            onChange={(e) => setPayload({ ...payload, upiId: e.target.value })}
          />
        </div>

        <div>
          <h2 className="text-base mb-2">QR Code Image</h2>
          {payload.qrCodeImage ? (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(payload.qrCodeImage)}
                alt="QR Preview"
                className="w-40 h-40 object-cover rounded border"
              />
            </div>
          ) : (
            <div
              className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <IoMdAdd className="mx-auto text-2xl text-gray-400" />
                <p className="text-sm text-gray-500">Add QR Code</p>
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPayload({ ...payload, qrCodeImage: file });
              }
            }}
          />
        </div>

        <div className="flex gap-4 mt-10 items-center justify-center">
          <Button title="Submit" onClick={handleSubmit} disabled={loading} />
          <Button title="Reset" onClick={handleReset} bgcolor="bg-red-500" disabled={loading} />
        </div>
      </div>
    </>
  );
};

export default BankDetails;
