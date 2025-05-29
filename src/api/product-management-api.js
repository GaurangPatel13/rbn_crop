import { Axios } from "../constants/mainContent";

const apiUrl = "http://192.168.29.134:8000";

export async function category() {
  const response = await Axios.get(`${apiUrl}/products/categories`,{withCredentials:true});
  return response?.data;
}
export async function addCategory(payload) {
  const response = await Axios.post(`${apiUrl}/products/addCategory`,payload,{withCredentials:true});
  return response?.data;
}

export async function addProductForm(payload) {
  const response = await Axios.post(`${apiUrl}/products/create`, payload,{withCredentials:true});
  return response?.data;
}


export async function updateProduct(id, data) {
  const response = await Axios.put(`${apiUrl}/product-update/${id}`, data);
  return response?.data;
}

export async function getAllProductList() {
  const response = await Axios.get(`${apiUrl}/products`);
  return response?.data;
}

export async function deleteProduct(id) {
  const response = await Axios.delete(`${apiUrl}/product-delete/${id}`);
  return response?.data;
}

export async function getAllUsers() {
  const response = await Axios.get(`${apiUrl}/get-all-users`);
  return response?.data;
}

export async function getLevelIncomePlan() {
  const response = await Axios.get(`${apiUrl}/get-all-levels`);
  return response?.data;
}

export async function updateLevelIncomePlan(levels) {
  const response = await Axios.put(`${apiUrl}/update-levels`,levels);
  return response?.data;
}
export async function getEpinVouchers() {
  const response = await Axios.get(`${apiUrl}/get-epins`);
  return response?.data;
}

export async function updateEpinStatus(id, status) {
  const response = await Axios.put(`${apiUrl}/update-epin-status/${id}`,{status:status});
  return response?.data;
}

export async function getAllOrders() {
  const response = await Axios.get(`${apiUrl}/orders`);
  return response?.data;
}

export async function updateOrderStatus(id, status) {
  const response = await Axios.put(`${apiUrl}/order-update/${id}`,{status:status});
  return response?.data;
}

export async function getDashboardDetails() {
  const response = await Axios.get(`${apiUrl}/get-dashboardData`);
  return response?.data;
}
export async function getLevelIncomeHistory() {
  const response = await Axios.get(`${apiUrl}/get-level-income-history`);
  return response?.data;
}

export async function updateWithdrawStatus(id, status) {
  const response = await Axios.put(`${apiUrl}/update-withdrawalStatus/${id}`,{isWithdrawalRequest:status});
  return response?.data;
}

export async function getAllWithdrawals() {
  const response = await Axios.get(`${apiUrl}/get-all-withdrawals`);
  return response?.data;
}

export async function withdrawalRequestStatus(id, status) {
  const response = await Axios.put(`${apiUrl}/withdrawal-request-status/${id}`,{status:status});
  return response?.data;
}
// **********************************************************************




export async function filterProducts(year, month, date) {
  const queryParams = new URLSearchParams();

  if (year) queryParams.append("year", year);
  if (month) queryParams.append("month", month);
  if (date) queryParams.append("date", date);

  const queryString = queryParams.toString();
  const url = `${apiUrl}/filter-products${queryString ? `?${queryString}` : ""}`;

  const response = await Axios.get(url);
  return response?.data;
}

