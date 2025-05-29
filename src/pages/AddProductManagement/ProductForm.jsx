/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Swal from "sweetalert2";
import { IoMdAdd } from "react-icons/io";
import PageLoader from "../../components/ui/PageLoader";
import "react-quill/dist/quill.snow.css";
import SelectComponent from "../../components/SelectComponent";
import { addProductForm, getAllCategories } from "../../api/admin-api";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";

const ProductForm = ({ productData, isEditMode, onClose }) => {
  const dispatch = useDispatch();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    features: [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const categoriesList = response?.subCategories || [];
        const updatedList = [
          ...categoriesList.map((cat) => ({
            name: cat.name,
            value: cat.value ?? cat.name,
          })),
        ];
        setCategoryOptions(updatedList);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!productData) return;
    setPayload({
      name: productData.name || "",
      category: productData.category || "",
      description: productData.description || "",
      dosage: productData.dosage || "",
      originalPrice: productData.originalPrice || "",
      sellingPrice: productData.sellingPrice || "",
      packingValue: productData.packingValue || "",
      packingUnit: productData.packingUnit || "",
      stock: productData.stock || "",
      images: [],
      features: productData.features || [],
    });
  }, [productData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let checked = 0;

    files.forEach((file) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === img.height) {
          validFiles.push(file);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Invalid Image",
            text: "Only square images (1:1 aspect ratio) are allowed.",
          });
        }
        checked++;
        if (checked === files.length) {
          setPayload((prev) => ({
            ...prev,
            images: [...prev.images, ...validFiles],
          }));
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

  const addFeature = () => {
    if (featureInput.trim()) {
      setPayload((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setPayload((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "category",
      "originalPrice",
      "sellingPrice",
      "packingValue",
      "packingUnit",
      "stock",
    ];

    for (let field of requiredFields) {
      if (!payload[field]) {
        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: `${field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())} is required.`,
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return;
        if (key === "features") {
          value.forEach((f) => formData.append("features[]", f));
        } else {
          formData.append(key, value);
        }
      });

      payload.images.forEach((file) => {
        formData.append("images", file);
      });

      const result = await addProductForm(formData);

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result?.message || "Product saved successfully",
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
      name: "",
      category: "",
      description: "",
      dosage: "",
      originalPrice: "",
      sellingPrice: "",
      packingValue: "",
      packingUnit: "",
      stock: 0,
      images: [],
      features: [],
    });
    setFeatureInput("");
  };

  const removeImage = (index) => {
    setPayload((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-5">
        {/* Form Inputs */}
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
            options={categoryOptions}
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
            name="packingUnit"
            value={payload.packingUnit}
            onChange={(e) =>
              setPayload({ ...payload, packingUnit: e.target.value })
            }
            options={[
              { name: "l", value: "l" },
              { name: "kg", value: "kg" },
              { name: "ml", value: "ml" },
              { name: "gm", value: "gm" },
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
            onChange={(e) => setPayload({ ...payload, stock: +e.target.value })}
          />
        </div>

        <InputField
          label="Description"
          name="description"
          type="textarea"
          maxLength={150}
          value={payload.description}
          onChange={(e) =>
            setPayload({ ...payload, description: e.target.value })
          }
        />

        {/* Features Section */}
        <div>
          <h2 className="text-base mb-2">Product Features</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Enter a feature"
              className="border rounded px-3 py-2 w-full focus:outline-none"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {payload.features.map((feat, idx) => (
              <li
                key={idx}
                className="bg-gray-200 px-3 py-1 rounded-lg flex items-center text-gray-600 text-sm gap-2"
              >
                {feat}
                <button
                  onClick={() => removeFeature(idx)}
                  className="text-base text-red-500 hover:bg-red-500 hover:text-white transition-all rounded font-bold"
                >
                  <MdDeleteForever />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Images Section */}
        <div>
          <h2 className="text-base mb-4">
            Product Images{" "}
            <span className="text-xs font-bold text-red-600">
              (Only 1:1 square)
            </span>
          </h2>
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

        {/* Buttons */}
        <div className="flex gap-4 mt-20 items-center justify-center">
          <ButtonWithIcon
            title={isEditMode ? "Update Product" : "Add Product"}
            onClick={handleSubmit}
            disabled={loading}
          />
          <ButtonWithIcon
            title="Reset"
            bgcolor="bg-[#FF5F5F]"
            onClick={handleReset}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ProductForm;
