import React from 'react';
import img from '../../assets/productlist/img.jpg'
import PageLoader from '../../components/ui/PageLoader';
import InputField from '../../components/InputField';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

const ProductDetail1 = ({ productData }) => {

  if (!productData) return <PageLoader />;

  const productImages = productData.images || [];

  return (
    <div className="bg-white rounded-xl space-y-7 p-4">
      <div className="flex justify-between items-center">
        <h1 className="md:text-2xl text-xl font-medium">
          <span className="text-bg-color font-normal">{productData.name}</span>
        </h1>
      </div>

      <form id="form" className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-4 rounded-lg shadow">

        <div className='flex flex-col gap-1'>

          <InputField label="Product Name:" name="name" value={productData.name || ""} disabled />
        </div>

        <div className='flex flex-col gap-1'>

          <InputField label="Product Price:" name="price" value={productData.price || ""} disabled />

        </div>

        <div className='flex flex-col gap-1'>

          <InputField label="Product Stock:" name="stock" value={productData.stock || 0} disabled />
        </div>


      </form>

      <div className="space-y-6">
        <div className="">
          <h2 className="text-base font-normal">Detailed Description</h2>
          <ReactQuill
            value={productData.description || ""}
            readOnly={true}
            theme="bubble" // Uses a minimal, non-editable theme
            className="w-full border rounded p-2 mt-2 text-sm bg-bg-color1/20"
          />
        </div>


      </div>

      <div>
        <h2 className="text-base font-normal">Product Images</h2>
        <div className="grid xl:grid-cols-5 lg:px-20 md:px-16 sm:px-10 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 lg:gap-10 md:gap-8 gap-5 mt-4">
          {productImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product ${index + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg"
              }}
              className="w-full h-40 object-cover rounded border"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail1;
