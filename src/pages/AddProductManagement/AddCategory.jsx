import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import PageLoader from "../../components/ui/PageLoader";
import {
  addCategory,
  getAllCategories,
  deleteCategory,
} from "../../api/admin-api";
import Swal from "sweetalert2";
import { MdDeleteForever } from "react-icons/md";

const CategoryTabs = () => {
  const [tab, setTab] = useState("category");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryInput, setCategoryInput] = useState({ name: "", image: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.success && Array.isArray(response.subCategories)) {
          setCategories(response.subCategories);
          console.log(response.subCategories);
        } else {
          setCategories([]);
          console.warn("No categories found or response malformed");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const formatCategoryName = (name) => {
    return name
      ?.replace(/_/g, " ") // Replace underscores with spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const handleDeleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel", // Optional: customize cancel button text
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const res = await deleteCategory(id);
        if (res?.success) {
          setCategories((prev) => prev.filter((cat) => cat._id !== id));
          Swal.fire("Deleted!", res.message || "Category deleted.", "success");
        } else {
          Swal.fire(
            "Error",
            res.message || "Could not delete category",
            "error"
          );
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Something went wrong",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const response = await addCategory(categoryInput);
      if (response?.success) {
        setCategories((prev) => [...prev, response?.category]);
        setCategoryInput({ name: "", image: "" });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.message || "Category added successfully",
        });
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
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="p-6 bg-white shadow-xl rounded-xl">
        {/* Tabs */}
        {/* <div className="flex justify-around p-4 rounded-md">
          <ButtonWithIcon
            title="Add Category"
            bgcolor={tab === "category" ? "bg-red-500" : ""}
            onClick={() => setTab("category")}
            className={tab === "category" ? "border-b border-white" : ""}
          />
        </div> */}

        {/* Category Form */}
        <AnimatePresence mode="wait">
          {tab === "category" && (
            <motion.div
              key="category"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mt-4"
            >
              <InputField
                type="text"
                label="Category Name"
                placeholder="Enter category name"
                value={categoryInput.name}
                onChange={(e) =>
                  setCategoryInput({ ...categoryInput, name: e.target.value })
                }
              />
              <Button title="Add Category" onClick={handleAddCategory} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Cards */}
        {categories?.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((cat, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 flex items-center justify-between"
              >
                <h3 className="text-sm font-semibold">
                  {formatCategoryName(cat?.name)}
                </h3>
                <button
                  className="text-red-500 hover:bg-red-500 hover:text-white hover:transition-all hover:duration-700 rounded font-bold text-2xl"
                  onClick={() => handleDeleteCategory(cat?._id)}
                >
                  <MdDeleteForever />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryTabs;
