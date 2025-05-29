import { motion } from "framer-motion";
import ProductForm from "./ProductForm";
import PageLoader from "../../components/ui/PageLoader";


export default function AddProductManagement() {

  return (
    <>

      <div className=" flex flex-col rounded-xl space-y-5 ">
        {/* <h1 className="lg:text-xl md:text-lg text-sm font-medium">
          Add Products
        </h1> */}

        <div className="bg-white p-6 rounded-lg w-full">

          <motion.div
            key="Product"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProductForm />
          </motion.div>

        </div>
      </div>
    </>
  );
}
