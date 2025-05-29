import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import ButtonWithIcon from '../components/ButtonWithIcon';
import { FaSave, FaEdit } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { getUserById, updateUserProfile } from '../api/admin-api';
import { formatDateForInput } from '../utils/dateFunctions';
import Swal from 'sweetalert2';
import SelectComponent from '../components/SelectComponent';
import PageLoader from '../components/ui/PageLoader';
import BackButton from '../components/BackButton';

const ProfileUpdate = () => {
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
    address: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    panNo: '',
    aadharNo: '',
    nomineeName: '',
    nomineeAadhar: '',
    nomineeRelation: '',
    nomineeDOB: '',
    sponsorId: '',
    sponsorName: '',
    joiningDate: '',
    password: '',
    userProfile: '',
    panImage: '',
    aadharFront: '',
    aadharBack: '',
    gender: '',
    maritalStatus: '',
    branchName: '',
    profession: '',
  });
  const [isEditable, setIsEditable] = useState(false);
  const location = useLocation();
  const id = location.state;

  useEffect(() => {
    getUserById(id).then((res) => {
      console.log(res);

      setFormData({
        name: (res?.name || res?.generalDetails?.distributorName) ?? '',
        fatherName: res?.generalDetails?.fatherName ?? '',
        mobile: res?.mobile ?? '',
        email: res?.email ?? '',
        dob: res?.dob ?? '',
        gender: res?.gender || "",
        maritalStatus: (res?.maritalStatus || res?.generalDetails?.maritalStatus) ?? "",
        city: res?.generalDetails?.city ?? '',
        state: res?.generalDetails?.state ?? '',
        pincode: res?.generalDetails?.pincode ?? '',
        address: res?.generalDetails?.address ?? '',
        bankName: res?.generalDetails?.bankName ?? '',
        branchName: res?.generalDetails?.branchName ?? '',
        accountNo: res?.generalDetails?.accountNo ?? '',
        profession: res?.generalDetails?.profession ?? '',
        ifscCode: res?.generalDetails?.IFSC ?? '',
        panNo: res?.generalDetails?.panDetails ?? '',
        aadharNo: res?.generalDetails?.aadharNo ?? '',
        nomineeName: res?.generalDetails?.nomineeName ?? '',
        nomineeAadhar: res?.generalDetails?.nomineeAadhar ?? '',
        nomineeRelation: res?.generalDetails?.nomineeRelation ?? '',
        nomineeDOB: res?.generalDetails?.nomineeDOB ?? '',
        sponsorId: res?.generalDetails?.sponserId ?? '',
        sponsorName: res?.generalDetails?.sponserName ?? '',
        joiningDate: res?.generalDetails?.DOJ ?? '',
        password: res?.key,
        userProfile: res?.generalDetails?.userProfile ?? '',
        panImage: res?.generalDetails?.panImage ?? '',
        aadharFront: res?.generalDetails?.aadharFront ?? '',
        aadharBack: res?.generalDetails?.aadharBack ?? '',
        
      });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      // Convert the file to base64 and update the formData state
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [name]: reader.result, // Store the base64 image string
        }));
      };
      reader.readAsDataURL(file); // Convert image file to base64
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(id, formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully',
      });
      setIsEditable(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'There was an error updating the profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <PageLoader />}
     <div className="md:p-6 p-3 bg-white shadow rounded-md">
      <div className='flex gap-4 mb-6'>
      <BackButton />
  <h1 className="text-2xl font-semibold ">Profile Updation</h1>
      </div>
    
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="mb-4">
          {!isEditable && (
            <ButtonWithIcon
              title="Edit Profile"
              icon={<FaEdit />}
              onClick={handleEditClick}
              type="button"
            />
          )}
          {isEditable && (
            <ButtonWithIcon
              title="Save Profile"
              icon={<FaSave />}
              type="submit"
              loading={loading}
            />
          )}
        </div>

        <h2 className="text-xl font-bold">Image Upload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "User Photo", name: "userProfile", value: formData.userProfile },
            { label: "PAN Card Image", name: "panImage", value: formData.panImage },
            { label: "Aadhaar Front", name: "aadharFront", value: formData.aadharFront },
            { label: "Aadhaar Back", name: "aadharBack", value: formData.aadharBack },
          ].map((field) => (
            <div key={field.name} className="border p-2 rounded-md flex flex-col gap-2">
              <label className="block font-medium text-sm capitalize">{field.label}:</label>

              {field.value && (
                <img
                  src={field.value}
                  alt={`${field.label} Preview`}
                  className="w-full h-32 object-cover rounded border"
                />
              )}

              <InputField
                type="file"
                name={field.name}
                onChange={handleChange}
                accept=".jpg,.jpeg,.png"
                disable={!isEditable}
              />
            </div>
          ))}
        </div>
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Personal Details</legend>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <InputField name="name" label="Name" value={formData.name} onChange={handleChange} disable={!isEditable} />
            <InputField name="fatherName" label="Father/Guardian/Husband Name" value={formData.fatherName} onChange={handleChange} disable={!isEditable} />
            <InputField name="mobile" label="Mobile" value={formData.mobile} onChange={handleChange} disable={!isEditable} />
            <InputField name="email" label="Email" value={formData.email} onChange={handleChange} disable={!isEditable} />
            <InputField name="dob" label="D.O.B." type="date" value={formatDateForInput(formData.dob)} onChange={handleChange} disable={!isEditable} />
            <SelectComponent
              label="Select Gender *"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder={'--Select Gender--'}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              disable={!isEditable}
              // error={formErrors.gender}
            />  
              <SelectComponent
              label="Select Marital Status *"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              placeholder={'--Select Marital Status--'}
              options={[
                { value: "Married", label: "Married" },
                { value: "Unmarried", label: "Unmarried" },
              ]}
              disable={!isEditable}
              // error={formErrors.gender}
            />  
            <InputField name="joiningDate" label="Joining Date" type="date" value={formatDateForInput(formData.joiningDate)} onChange={handleChange} disable={true} />
            <InputField name="profession" label="Profession" value={formData.profession} onChange={handleChange} disable={!isEditable} />
          </section>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Bank Details</legend>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <InputField name="bankName" label="Bank Name" value={formData.bankName} onChange={handleChange} disable={!isEditable} />
            <InputField name="branchName" label="Branch Name" value={formData.branchName} onChange={handleChange} disable={!isEditable} />
            <InputField name="accountNo" label="Account No." value={formData.accountNo} onChange={handleChange} disable={!isEditable} />
            <InputField name="ifscCode" label="IFSC" value={formData.ifscCode} onChange={handleChange} disable={!isEditable} />
            <InputField name="panNo" label="PAN No." value={formData.panNo} onChange={handleChange} disable={!isEditable} />
            <InputField name="aadharNo" label="Aadhar/UID" value={formData.aadharNo} onChange={handleChange} disable={!isEditable} />
          </div>
        </fieldset>
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Address</legend>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <InputField name="address" label="Address" value={formData.address} onChange={handleChange} disable={!isEditable} />
            <InputField name="city" label="City" value={formData.city} onChange={handleChange} disable={!isEditable} />
            <InputField name="state" label="State" value={formData.state} onChange={handleChange} disable={!isEditable} />
            <InputField name="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} disable={!isEditable} />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Nominee Details</legend>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <InputField name="nomineeName" label="Nominee Name" value={formData.nomineeName} onChange={handleChange} disable={!isEditable} />
            <InputField name="nomineeRelation" label="Nominee Relation" value={formData.nomineeRelation} onChange={handleChange} disable={!isEditable} />
            <InputField name="nomineeDOB" label="Nominee D.O.B." type="date" value={formatDateForInput(formData.nomineeDOB)} onChange={handleChange} disable={!isEditable} />
            <InputField name="nomineeAadhar" label="Nominee Aadhar/UID" value={formData.nomineeAadhar} onChange={handleChange} disable={!isEditable} />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Sponsor Details</legend>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <InputField name="sponsorId" label="Sponsor ID" value={formData.sponsorId} onChange={handleChange} disable={true} />
            <InputField name="sponsorName" label="Sponsor Name" value={formData.sponsorName} onChange={handleChange} disable={true} />

          </div>
        </fieldset>
        <InputField name="password" label="Password" type="password" value={formData?.password} onChange={handleChange} disable={!isEditable} />


      </form>
    </div>
    </>
   
  );
};

export default ProfileUpdate;
