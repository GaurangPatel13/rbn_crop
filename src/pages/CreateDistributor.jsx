import React, { useState } from "react";
import InputField from "../components/InputField";
import ButtonWithIcon from "../components/ButtonWithIcon";
import PageLoader from "../components/ui/PageLoader";
import BackButton from "../components/BackButton";
import Swal from "sweetalert2";
import { createDistributor } from "../api/auth-api";

const CreateDistributor = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    franchiseName: "",
    ownerName: "",
    pincode: "",
    location: "",
    address: "",
    state: "",
    city: "",
    mobileNo: "",
    mobileNo2: "",
    gstNo: "",
    bankName: "",
    branchName: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    const accountRegex = /^\d{9,18}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.email.trim() || !emailRegex.test(formData.email))
      errors.email = "Valid email is required";

    if (!formData.password.trim() || formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (!formData.franchiseName.trim())
      errors.franchiseName = "Franchise Name is required";

    if (!formData.ownerName.trim()) errors.ownerName = "Owner name is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.city.trim()) errors.city = "City is required";

    if (!formData.mobileNo || !mobileRegex.test(formData.mobileNo)) {
      errors.mobileNo = "Invalid mobile number";
    }

    if (formData.mobileNo2 && !mobileRegex.test(formData.mobileNo2)) {
      errors.mobileNo2 = "Invalid alternate mobile number";
    }

    if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
    if (!formData.branchName.trim())
      errors.branchName = "Branch name is required";

    if (!formData.accountNo || !accountRegex.test(formData.accountNo)) {
      errors.accountNo = "Invalid account number";
    }

    if (!formData.ifscCode || !ifscRegex.test(formData.ifscCode)) {
      errors.ifscCode = "Invalid IFSC code";
    }

    if (!formData.panNo || !panRegex.test(formData.panNo)) {
      errors.panNo = "Invalid PAN number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: name === "ifscCode" ? value.toUpperCase() : value,
    };

    if (name === "pincode" && value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await res.json();
        const postOffice = data[0]?.PostOffice?.[0];

        if (postOffice) {
          updatedData.address = postOffice.Name || "";
          updatedData.city = postOffice.District || "";
          updatedData.state = postOffice.State || "";
          updatedData.location = postOffice.Block || postOffice.District || "";
        }
      } catch (err) {
        console.error("Pincode fetch failed:", err);
      }
    }

    if (name === "ifscCode" && value.length === 11) {
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${value.toUpperCase()}`);
        if (!res.ok) throw new Error("Invalid IFSC");
        const data = await res.json();

        updatedData.bankName = data.BANK || "";
        updatedData.branchName = data.BRANCH || "";
      } catch (err) {
        updatedData.bankName = "";
        updatedData.branchName = "";
        console.error("IFSC fetch failed:", err);
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await createDistributor(formData);
      if (response?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          html: `
            <div style="text-align: left;">
              <p><strong>Name:</strong> ${response?.data?.name || "N/A"}</p>
              <p><strong>FCID:</strong> ${response?.data?.username || "N/A"}</p>
              <p><strong>Password:</strong> ${response?.data?.key || "N/A"}</p>
            </div>
          `,
          showCloseButton: true,
          showConfirmButton: false,
          width: 500,
        });

        setFormData({
          name: "",
          email: "",
          password: "",
          franchiseName: "",
          ownerName: "",
          pincode: "",
          location: "",
          address: "",
          state: "",
          city: "",
          mobileNo: "",
          mobileNo2: "",
          gstNo: "",
          bankName: "",
          branchName: "",
          accountNo: "",
          ifscCode: "",
          panNo: "",
        });

        setFormErrors({});
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.message || "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.msg || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="flex bg-white p-6 rounded-lg w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center gap-3 mb-4">
            <BackButton />
            <h1 className="text-sm md:text-lg font-medium">Create Franchise</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
            />
            <InputField
              label="Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            <InputField
              label="Password *"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
            />
            <InputField
              label="Franchise Name *"
              name="franchiseName"
              value={formData.franchiseName}
              onChange={handleChange}
              error={formErrors.franchiseName}
            />
            <InputField
              label="Owner Name *"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              error={formErrors.ownerName}
            />
            <InputField
              label="Pincode *"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,6}$/.test(val)) {
                  handleChange(e);
                }
              }}
              error={formErrors.pincode}
            />

            <InputField
              label="Location *"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={formErrors.location}
            />
            <InputField
              label="Address *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={formErrors.address}
            />
            <InputField
              label="State *"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={formErrors.state}
            />
            <InputField
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={formErrors.city}
            />
            <InputField
              label="Mobile No *"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              error={formErrors.mobileNo}
            />
            <InputField
              label="Alternate Mobile No"
              name="mobileNo2"
              value={formData.mobileNo2}
              onChange={handleChange}
              error={formErrors.mobileNo2}
            />
            <InputField
              label="GST No"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
            />
            <InputField
              label="IFSC Code *"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              error={formErrors.ifscCode}
            />
            <InputField
              label="Bank Name *"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              error={formErrors.bankName}
            />
            <InputField
              label="Branch Name *"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              error={formErrors.branchName}
            />
            <InputField
              label="Account No *"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleChange}
              error={formErrors.accountNo}
            />
            <InputField
              label="PAN No *"
              name="panNo"
              value={formData.panNo}
              onChange={handleChange}
              error={formErrors.panNo}
            />
          </div>

          <ButtonWithIcon
            type="submit"
            icon="save"
            className="mt-6 w-full md:w-auto"
          >
            Save
          </ButtonWithIcon>
        </form>
      </div>
    </>
  );
};

export default CreateDistributor;
