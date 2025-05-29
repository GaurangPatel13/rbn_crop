import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import TableComponent from "../../components/TableComponent";
import {
  deleteProducts,
  getAllProducts,
  updateStockStatus,
} from "../../api/admin-api";
import Swal from "sweetalert2";
import PageLoader from "../../components/ui/PageLoader";
import ProductForm from "../AddProductManagement/ProductForm";
import Modal from "../../components/Modal";
import ToggleButton from "../../components/ToggleButton";
import { useNavigate } from "react-router-dom";

const ProductSummary = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      console.log(response);
      if (response?.success) {
        setProducts(response?.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action will delete the product permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const res = await deleteProducts(id);
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Product Deleted!",
          text: "Product deleted successfully",
        });
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not delete the product.",
      });
    }
  }

  // If result.isDismissed (i.e., cancel or outside click), do nothing
};


  const handleStockStatus = async (id) => {
    try {
      const res = await updateStockStatus(id);
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Stock Status Updated!",
          position: "top-end",
          toast: true,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        setProducts((prev) =>
          prev.map((product) =>
            product._id === id
              ? { ...product, isActive: !product.isActive }
              : product
          )
        );
      }
    } catch (err) {
      console.error("Stock status update error:", err);
    }
  };

  const handleEdit = (product) => {
  navigate("/edit-product", { state: { product } });
};


  const stockStatusCheck = (stockCount, status, stockSize) => {
    const hasStock =
      !!Number(stockCount) || Object.values(stockSize || {}).some((val) => val > 0);
    return hasStock && status;
  };

  const headers = [
    "ID",
    "Name",
    "Category",
    "Price",
    "Created At",
    "Picture",
    "Status",
    "Action",
  ];

  return (
    <>
      {loading && <PageLoader />}
      <div className="bg-white rounded-lg w-full">
        <div className="overflow-x-auto">
          <TableComponent
            title="Product Summary"
            headers={headers}
            data={Array.isArray(products) ? products : []}
            searchKey="Product Name"
            searchKeys={["name"]}
            renderRow={(item, index) => (
              <tr key={item._id}>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  {item?.name}
                </td>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  {item?.category}
                </td>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  ₹{item?.sellingPrice}
                </td>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(item?.createdAt))}
                </td>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  {item?.images?.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt="Product"
                      className="w-16 h-10 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="border-r border-b p-2 md:p-3 whitespace-nowrap">
                  <ToggleButton
                    isEnabled={stockStatusCheck(
                      item?.stock,
                      item?.isActive,
                      item?.sizes
                    )}
                    onToggle={() => handleStockStatus(item._id)}
                  />
                </td>
                <td className="border-b p-2 md:p-3 whitespace-nowrap">
                  <div className="flex gap-4 items-center">
                    <ButtonWithIcon
                      title="Edit"
                      icon={<BiEdit />}
                      onClick={() => handleEdit(item)}
                      bgcolor="bg-green-500"
                      btnclass="md:block hidden"
                    />
                    {/* <ButtonWithIcon
                      title="Delete"
                      icon={<RiDeleteBin6Line />}
                      onClick={() => handleDelete(item._id)}
                      bgcolor="bg-red-500"
                      btnclass="md:block hidden"
                    /> */}
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Update Product"
      >
        <ProductForm
          productData={selectedProduct}
          isEditMode={true}
          onClose={() => {
            setModalOpen(false);
            fetchProducts(); // refresh table after edit
          }}
        />
      </Modal>
    </>
  );
};

export default ProductSummary;
