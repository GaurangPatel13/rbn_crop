import React, { useState } from 'react';
import Swal from 'sweetalert2';
import InputField from '../../components/InputField';
import { addNews } from '../../api/admin-api';
import { convertToBase64 } from '../../utils/additionalFunction';

const AddNews = () => {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      try {
        const base64 = await convertToBase64(files[0]);
        setFormData({ ...formData, [name]: base64 });
      } catch (err) {
        console.error("Error converting to base64:", err);
        Swal.fire('Error', 'Failed to upload image.', 'error');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await addNews(formData);
      if (response?.message == "News added successfully") {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response?.message || 'News added successfully',
        });
        setFormData({ image: '', title: '', description: '' });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response?.error?.message || 'Something went wrong',
        })
      }


    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-5 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add News</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <InputField
          name="title"
          label="Title"
          type="text"
          value={formData.title}
          onChange={handleChange}
        />
        <InputField
          name="description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
        />
        <InputField
          name="image"
          label="Upload Image"
          type="file"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-bg-color'}`}
        >
          {loading ? 'Submitting...' : 'Submit News'}
        </button>
      </form>
    </div>
  );
};

export default AddNews;
