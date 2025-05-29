import { useEffect, useState } from "react";
import TableComponent from "./TableComponent";
import Footer1 from "../../components/Footer1";
import { getAllProductList } from "../../api/product-management-api";

const ProductList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getAllProductList().then((res) => setData(res?.products));
    }, []);
console.log(data)
    return (
        <div className="flex flex-col gap-5">
            <TableComponent tittle={"All Product List"} data={data.reverse() || []} />
            <Footer1 />
        </div>
    );
};

export default ProductList;
