import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./slice/UserInfoSlice";
import vendorManagementSlice from "./slice/vendorManagementSlice";
import  imageVideoSlice  from "./slice/ImageVideoSlice";
import  ProductSlice  from "./slice/ProductSlice";


const SsStore = configureStore({
  reducer: {
    userInfo: userInfoSlice,
    vendorData: vendorManagementSlice,
    imageVideo: imageVideoSlice,
    product:ProductSlice

  },
});

export default SsStore;
