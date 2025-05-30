import axios from "axios";
import logo from "../assets/images/logo.png";

export const MainContent = {
  name: "Aetheric Dynamics",
  logo: logo,
};
export const backendConfig = {
  base: "http://192.168.1.21:5555/api",
  origin: "http://192.168.1.21:5555",
  
  // base: "http://192.168.1.14:3060/api",
  // origin: "http://192.168.1.14:3060",
  // base: "https://adm.api.smartchainstudio.in/api",
  // origin: "https://adm.api.smartchainstudio.in",

  // base: "https://api.admfashion.com/api",
  // origin: "https://api.admfashion.com",

  // base: "https://cnfp6kct-3040.inc1.devtunnels.ms/api",
  // origin: "https://cnfp6kct-3040.inc1.devtunnels.ms/",

};

const token = localStorage.getItem("token");
export const Axios = axios.create({
  baseURL: backendConfig.base,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
 