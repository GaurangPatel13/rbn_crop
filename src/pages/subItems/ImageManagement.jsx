import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";
import ToggleButton from "../../components/ToggleButton"; // Your existing toggle button
import { deleteImage, toggleImageStatus, getAllImages } from "../../api/admin-api"; // Assume these exist
import PageLoader from "../../components/ui/PageLoader";

const ImageManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  // Local active status map for each image URL
  const [activeStatus, setActiveStatus] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await getAllImages(); // Your API call
      if (res?.success && Array.isArray(res.banners)) {
          setImages(res?.banners?.[0]?.images || []);
        // Initialize all images as active (or get real status from backend if available)
        const statusMap = {};
        res.banners.forEach((url) => (statusMap[url] = true));
          setActiveStatus(statusMap);
          console.log(statusMap);
      }
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageUrl) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteImage(imageUrl);
        if (res?.success) {
          Swal.fire("Deleted!", "Image deleted successfully.", "success");
          setImages((prev) => prev.filter((url) => url !== imageUrl));
          setActiveStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[imageUrl];
            return newStatus;
          });
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete image.", "error");
      }
    }
  };

  const handleToggleStatus = async (imageUrl) => {
    const newStatus = !activeStatus[imageUrl];
    try {
      const res = await toggleImageStatus(imageUrl, newStatus);
      if (res?.success) {
        setActiveStatus((prev) => ({
          ...prev,
          [imageUrl]: newStatus,
        }));
        Swal.fire({
          icon: "success",
          title: `Image ${newStatus ? "activated" : "deactivated"}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white rounded-lg w-full p-4">
        <h2 className="text-xl font-semibold mb-4">Image Management</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {images.map((url, idx) => (
              <tr key={url} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{idx + 1}</td>
                <td className="border p-2 flex items-center justify-center">
                  <img
                    src={url}
                    alt={`Image ${idx + 1}`}
                    className="w-32 h-20 object-contain"
                  />
                </td>
                <td className="border p-2 text-center text-green-600 bg-green-100 font-bold ">
                  {/* <ToggleButton
                    isEnabled={true}
                    // onToggle={() => handleToggleStatus(url)}
                  /> */}
                        Active
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(url)}
                    className="p-2 rounded text-red-600 bg-red-300 hover:text-red-300 hover:bg-red-500"
                    aria-label="Delete Image"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {images.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No images available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ImageManagement;
