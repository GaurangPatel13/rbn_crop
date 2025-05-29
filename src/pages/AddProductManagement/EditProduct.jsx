/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import PageLoader from "../../components/ui/PageLoader";
import SelectComponent from "../../components/SelectComponent";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import { addProductForm, editProduct, getAllCategories } from "../../api/admin-api";

const EditProduct = ({ productData, isEditMode, onClose }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [payload, setPayload] = useState({
    name: "",
    category: "",
    description: "",
    dosage: "",
    originalPrice: "",
    sellingPrice: "",
    packingValue: "",
    packingUnit: "",
    stock: "",
    images: [],
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const categoriesList = response?.subCategories || [];
        const updatedList = [
          { name: "Select Category", value: "" },
          ...categoriesList,
        ];
        setCategoryOptions(updatedList);

        if (!isEditMode) {
          setPayload((prev) => ({ ...prev, category: "" }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [isEditMode]);

  // Set default values if editing
  useEffect(() => {
    if (!productData || !isEditMode) return;
    setPayload({
      name: productData.name || "",
      category: productData.category || "",
      description: productData.description || "",
      dosage: productData.dosage || "",
      originalPrice: productData.originalPrice || 0,
      sellingPrice: productData.sellingPrice || 0,
      packingValue: productData.packingValue || 0,
      packingUnit: productData.packingUnit || "",
      stock: productData.stock || 0,
      images: productData.images || [], // Existing image URLs
    });
  }, [productData, isEditMode]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPayload((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setPayload((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all text fields
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value);
        }
      });

      // Append only new image files (not URLs)
      payload.images.forEach((img) => {
  if (typeof img === "string") {
    formData.append("existingImages[]", img); // Keep URLs as strings
  } else {
    formData.append("images", img); // Add new uploaded files
  }
});



      const result = isEditMode
        ? await editProduct(productData._id, formData)
        : await addProductForm(formData);

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result?.message || "Product saved successfully",
        });
        handleReset();
        onClose?.();
      } else {
        throw new Error(result?.message || "Failed to save");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPayload({
      name: "",
      category: "",
      description: "",
      dosage: "",
      originalPrice: 0,
      sellingPrice: 0,
      packingValue: 0,
      packingUnit: "",
      stock: 0,
      images: [],
    });
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <InputField
            label="Product Name"
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
          />

          <SelectComponent
            label="Category"
            value={payload.category}
            onChange={(e) =>
              setPayload({ ...payload, category: e.target.value })
            }
            options={categoryOptions.map((cat) => ({
              label: cat.name,
              value: cat.value ?? cat.name,
            }))}
          />

          <InputField
            label="Description"
            value={payload.description}
            onChange={(e) =>
              setPayload({ ...payload, description: e.target.value })
            }
          />

          <InputField
            label="Dosage"
            value={payload.dosage}
            onChange={(e) => setPayload({ ...payload, dosage: e.target.value })}
          />

          <InputField
            label="Original Price"
            type="number"
            value={payload.originalPrice}
            onChange={(e) =>
              setPayload({ ...payload, originalPrice: +e.target.value })
            }
          />

          <InputField
            label="Selling Price"
            type="number"
            value={payload.sellingPrice}
            onChange={(e) =>
              setPayload({ ...payload, sellingPrice: +e.target.value })
            }
          />

          <SelectComponent
            label="Packing Unit"
            value={payload.packingUnit}
            onChange={(e) =>
              setPayload({ ...payload, packingUnit: e.target.value })
            }
            options={[
              { label: "Select Unit", value: "" },
              { label: "l", value: "l" },
              { label: "kg", value: "kg" },
              { label: "ml", value: "ml" },
              { label: "gm", value: "gm" },
            ]}
          />

          <InputField
            label="Packing Value"
            type="number"
            value={payload.packingValue}
            onChange={(e) =>
              setPayload({ ...payload, packingValue: +e.target.value })
            }
          />

          <InputField
            label="Stock"
            type="number"
            value={payload.stock}
            onChange={(e) =>
              setPayload({ ...payload, stock: +e.target.value })
            }
          />
        </div>

        {/* Images Section */}
        <div>
          <h2 className="text-base mb-4">Product Images</h2>
          <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:grid-cols-6 gap-5">
            {payload.images.map((img, index) => (
              <div key={index} className="relative w-full h-40">
                <img
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt="preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
                  }}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            <div
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <IoMdAdd className="mx-auto text-2xl text-gray-400" />
                <p className="text-sm text-gray-500">Add Images</p>
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
        </div>

        <div className="flex gap-4 mt-20 items-center justify-center">
          <ButtonWithIcon
            title={isEditMode ? "Update Product" : "Add Product"}
            onClick={handleSubmit}
            disabled={loading}
          />
          <ButtonWithIcon
            bgcolor="bg-[#FF5F5F]"
            title="Reset"
            onClick={handleReset}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default EditProduct;
