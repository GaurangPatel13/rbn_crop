import React, { useState } from 'react';
import InputField from '../components/InputField';
import ButtonWithIcon from '../components/ButtonWithIcon';
import { FaSave } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { getUserById } from '../api/admin-api';
import { formatDateForInput } from '../utils/dateFunctions';
import PageLoader from '../components/ui/PageLoader';
import BackButton from '../components/BackButton';

const ViewProfile = () => {
  const [isEditable, setIsEditable] = useState(false); // State to control form editability
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    email: '',
    dob: '',
    city: '',
    state: '',
    pincode: '',
    address1: '',
    address2: '',
    bankName: '',
    accountNo: '',
    ifsc: '',
    panNo: '',
    aadhar: '',
    nomineeName: '',
    relation: '',
    nomineeDob: '',
    sponsorId: '',
    sponsorName: '',
    joiningDate: '',
    password: ''
  });
  const location = useLocation();

  useState(() => {
    try {
      setLoading(true);
      getUserById(location.state).then((res) => setFormData(res));
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }, []);


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  return (
   <>
   
   {loading && <PageLoader/>}
   
    <div className="p-6  bg-white shadow rounded-md">
      <div className="flex gap-4 items-center mb-6">
   <BackButton/>
      <h1 className="text-2xl font-semibold">User Profile</h1>
      </div>
   
      <form className="space-y-8">

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField disable={true} name="name" label="Name" value={formData?.name || formData?.generalDetails?.distributorName} onChange={handleChange} />
          <InputField disable={true} name="fatherName" label="Father/Guardian/Husband Name" value={formData?.generalDetails?.fatherName} onChange={handleChange} />
          <InputField disable={true} name="mobile" label="Mobile" value={formData?.mobile} onChange={handleChange} />
          <InputField disable={true} name="email" label="Email" value={formData?.email} onChange={handleChange} />
          <InputField disable={true} name="dob" label="D.O.B." type="date" value={formData.dob} onChange={handleChange} />
          <InputField disable={true} name="city" label="City" value={formData?.generalDetails?.city} onChange={handleChange} />
          <InputField disable={true} name="state" label="State" value={formData?.generalDetails?.state} onChange={handleChange} />
          <InputField disable={true} name="pincode" label="Pincode" value={formData?.generalDetails?.pincode} onChange={handleChange} />
          <InputField disable={true} name="address1" label="Address 1" value={formData?.generalDetails?.address} onChange={handleChange} />
        </section>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Bank Details</legend>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <InputField disable={true} name="bankName" label="Bank Name" value={formData?.generalDetails?.bankName} onChange={handleChange} />
            <InputField disable={true} name="accountNo" label="Account No." value={formData?.accountNo} onChange={handleChange} />
            <InputField disable={true} name="ifscCode" label="IFSC" value={formData?.ifscCode} onChange={handleChange} />
            <InputField disable={true} name="panNo" label="PAN No." value={formData?.panNo} onChange={handleChange} />
            <InputField disable={true} name="aadhar" label="Aadhar/UID" value={formData?.generalDetails?.accountNo} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Nominee Details</legend>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <InputField disable={true} name="nomineeName" label="Nominee Name" value={formData?.generalDetails?.nomineeName} onChange={handleChange} />
            <InputField disable={true} name="relation" label="Relation" value={formData?.generalDetails?.nomineeRelation} onChange={handleChange} />
            <InputField disable={true} name="nomineeAadhar" label="Nominee Aadhar" value={formData?.generalDetails?.nomineeAadhar} onChange={handleChange} />
            <InputField disable={true} name="nomineeDob" label="Nominee D.O.B." type="date" value={formatDateForInput(formData?.generalDetails?.nomineeDOB)} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Sponsor Details</legend>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <InputField disable={true} name="sponsorId" label="Sponsor ID" value={formData?.generalDetails?.sponserId} onChange={handleChange} />
            <InputField disable={true} name="sponsorName" label="Sponsor Name" value={formData?.generalDetails?.sponserName} onChange={handleChange} />
            <InputField disable={true} name="joiningDate" label="Joining Date" type="date" value={formatDateForInput(formData?.generalDetails?.DOJ)} onChange={handleChange} />
          </div>
        </fieldset>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "User Photo", name: "userProfile", value: formData?.generalDetails?.userProfile },
            { label: "PAN Card Image", name: "panImage", value: formData?.generalDetails?.panImage },
            { label: "Aadhaar Front", name: "aadharFront", value: formData?.generalDetails?.aadharFront },
            { label: "Aadhaar Back", name: "aadharBack", value: formData?.generalDetails?.aadharBack },
          ].map((field) => (
            <div key={field.name} className="border p-2 rounded-md flex flex-col gap-2">
              <label className="block font-medium text-sm capitalize">
                {field.label}:
              </label>

              {/* Image preview if value exists */}
              {field.value && (
                <img
                  src={field.value}
                  alt={`${field.label} Preview`}
                  className="w-full h-32 object-cover rounded border"
                />
              )}

             
            </div>
          ))}
        </div>
        <InputField disable={true} name="password" label="Password" type="password" value={formData?.key} onChange={handleChange} />


      </form>
    </div>
   </>
  );
};


export default ViewProfile;
