/* eslint-disable react/prop-types */
import { useState } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import { registerFranchise } from "../../api/admin-api";
import {
  emailValidator,
  nameValidator,
  phoneValidator,
} from "../../utils/InputValidator";

const FranchiseRegister = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    mobile: "",
    sponsorId: "",
  });
  const [payloadError, setpayloadError] = useState("");

const validateForm = () => {
  const { name, email, mobile, sponsorId } = payload;

  const nameError = nameValidator(name);
  const emailError = emailValidator(email);
  const mobileError = phoneValidator(mobile);

  const errors = {};

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (mobileError) errors.mobile = mobileError;

  setpayloadError(errors);

  return Object.keys(errors).length === 0;
};


  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const result = await registerFranchise(payload);

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: result?.message || "User registered successfully",
        });
        handleReset();
        onClose?.();
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: result?.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while registering.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPayload({
      name: "",
      email: "",
      mobile: "",
      sponsorId: "",
    });
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-5 bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <InputField
            label="Sponsor Id"
            type="text"
            value={payload.sponsorId}
            onChange={(e) =>
              setPayload({ ...payload, sponsorId: e.target.value })
            }
          />
          <InputField
            label="Name"
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            error={payloadError?.name}
          />
          <InputField
            label="Email"
            type="email"
            value={payload.email}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
            error={payloadError?.email}
          />
          <InputField
            label="Mobile"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            onWheel={(e) => e.target.blur()}
            value={payload.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPayload({ ...payload, mobile: val });
            }}
            error={payloadError?.mobile}
          />
        </div>

        <div className="flex gap-4 mt-8 items-center justify-center">
          <Button title="Register" onClick={handleSubmit} disabled={loading} />
          <Button
            title="Reset"
            onClick={handleReset}
            bgcolor="bg-red-500"
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default FranchiseRegister;
