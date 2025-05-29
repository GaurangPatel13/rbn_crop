import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditProduct from "../AddProductManagement/EditProduct";

const EditProductPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Product data passed via navigate('/edit-product', { state: { product } })
  const productData = state?.product;

  // Redirect if no product data (e.g., on hard reload)
  useEffect(() => {
    if (!productData) {
      navigate("/product-summary");
    }
  }, [productData, navigate]);

  // While redirecting or no data, don't render the form
  if (!productData) return null;

  return (
    <div className="p-4 bg-white rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <EditProduct
        productData={productData}
        isEditMode={true}
        onClose={() => navigate("/product-summary")}
      />
    </div>
  );
};

export default EditProductPage;
