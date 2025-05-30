/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import PageLoader from "../../components/ui/PageLoader";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { addBannerImages } from "../../api/admin-api";
import { MdDeleteForever } from "react-icons/md";

const BannerImages = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const isValidAspectRatio = (width, height) => {
    const requiredRatio = 3100 / 1520; // ~2.039
    const actualRatio = width / height;
    return Math.abs(actualRatio - requiredRatio) < 0.01;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let checked = 0;

    files.forEach((file) => {
      const img = new Image();
      img.onload = () => {
        if (isValidAspectRatio(img.width, img.height)) {
          validFiles.push(file);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Invalid Image",
            text: "Only images with 3100x1520 aspect ratio (~2.04:1) are allowed.",
          });
        }
        checked++;
        if (checked === files.length) {
          setImages((prev) => [...prev, ...validFiles]);
        }
      };
      img.onerror = () => {
        checked++;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load one of the selected images.",
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Minimum 3 Images Required",
        text: "Please upload at least 3 valid images.",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));

      const result = await addBannerImages(formData);

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result?.message || "Images uploaded successfully",
        });
        setImages([]);
        onClose?.();
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: result?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-5 bg-white p-4 rounded-lg">
        <h2 className="text-base mb-4">
          Product Images{" "}
          <span className="text-xs font-bold text-red-600">
            (Min 3 images with 3100x1520 ratio)
          </span>
        </h2>

        <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:grid-cols-6 gap-5">
          {images.map((img, index) => (
            <div key={index} className="relative w-full h-40">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                aria-label="Remove image"
              >
                <MdDeleteForever />
              </button>
            </div>
          ))}

          <div
            className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="text-center">
              <IoMdAdd className="mx-auto text-2xl text-gray-400" />
              <p className="text-sm text-gray-500">Add Image</p>
            </div>
          </div>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="flex justify-center mt-10">
          <ButtonWithIcon
            title="Submit Images"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default BannerImages;
