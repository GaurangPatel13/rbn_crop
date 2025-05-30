import { Axios } from "../constants/mainContent";

const apiUrl = "/admin";

export async function registerFranchise(payload) {
    try {
        const response = await Axios.post(`/franshise/register`, payload);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data;
    }
}

export async function addNews(payload) {
    try {
         const response = await Axios.post(`${apiUrl}/news-create`, payload);
    return response?.data;
    } catch (error) {
        return  error?.response?.data;
    }
   
}
export async function addCategory(payload) {
    try {
          const response = await Axios.post(`${apiUrl}/create-sub-category`, payload);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
  
}

export async function addSubCategory(payload) {
    try {
        const response = await Axios.post(`${apiUrl}/add-subcategory`, payload);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
    
}

export async function addChildCategory(payload) {
    try {
        const response = await Axios.post(`${apiUrl}/add-subsubcategory`, payload);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data;
    }
}

export async function getAllCategories() {
    try {
        const response = await Axios.get(`${apiUrl}/get-all-sub-categories`);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data;
    }
}

export async function deleteCategory(id) {
    try {
    const response = await Axios.delete(`${apiUrl}/delete-sub-category/${id}`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}


export async function getSubCategorybyCategory(category) {
    try {
        const response = await Axios.get(`${apiUrl}/getSubcategories/?category=${category}`);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data;
    }

}

export async function addProductForm(formData) {
  try {
    const response = await Axios.post(`${apiUrl}/add-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function addBannerImages(formData) {
  try {
    const response = await Axios.post(`${apiUrl}/add-banners`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function addBankDetails(formData) {
  try {
    const response = await Axios.post(`${apiUrl}/add-bank-details`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}


export async function getAllProducts() {
    try {
    const response = await Axios.get(`${apiUrl}/get-all-products`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}

export async function getAllImages() {
    try {
    const response = await Axios.get(`${apiUrl}/get-banners`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}

export async function deleteProducts(id) {
    try {
    const response = await Axios.delete(`${apiUrl}/delete-product/${id}`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}

export async function deleteImage(id) {
    try {
    const response = await Axios.delete(`${apiUrl}/delete-product/${id}`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}

export async function updateStockStatus(id) {
    try {
    const response = await Axios.patch(`${apiUrl}/toggle-product-status/${id}`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}

export async function toggleImageStatus(id) {
    try {
    const response = await Axios.patch(`${apiUrl}/toggle-product-status/${id}`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
        }
}

export async function editProduct(id, formData) {
  try {
    const response = await Axios.put(`${apiUrl}/update-product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}




export async function getAllUsersList() {
    try {
        const response = await Axios.get(`${apiUrl}/get-all-users`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export async function getAllFranchiseList() {
    try {
        const response = await Axios.get(`${apiUrl}/get-all-franchises`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export async function updateUserRank(id, data) {
    try {
    const response = await Axios.put(`${apiUrl}/updateRank/${id}`, data);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}
export async function deleteUser(id) {
    try {
    const response = await Axios.get(`${apiUrl}/user-block/${id}`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export async function getDashboardDetails() {
    try {
    const response = await Axios.get(`${apiUrl}/admin-dashboard-stats`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export async function getRecentOrders() {
    try {
    const response = await Axios.get(`${apiUrl}/get-recent-orders`);
    return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export async function getUserById(id) {
    try {
        const response = await Axios.get(`${apiUrl}/getUser/${id}`);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data;
    }
}

export async function updateUser(id, data) {
    try {
        const response = await Axios.put(`${apiUrl}/updateUser/${id}`, data);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
}

export async function getAllOrders() {
    try {
        const response = await Axios.get(`${apiUrl}/get-all-orders`);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
}

export async function updateUserProfile(id, data) {
    try {
        const response = await Axios.put(`${apiUrl}/update-user/${id}`, data);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
}

export async function getUserByFcid(data) {
    try {
        const response = await Axios.post(`${apiUrl}/get-user-by-fcid`, data);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
}

export async function addFund(data) {
    try {
        const response = await Axios.post(`${apiUrl}/add-fund`, data);
        return response?.data;
        
    } catch (error) {
        console.log(error)
        return error?.response?.data
    }
}

export async function getFundRequestHistory(query) {
    try {
        if (query) {
            const response = await Axios.get(`${apiUrl}/get-all-fund-request/${query}`);
            return response?.data;
        } else {
            const response = await Axios.get(`${apiUrl}/get-all-fund-request`);
            return response?.data;
        }
        
    } catch (error) {
        return error?.response?.data
    }
}
export async function getwithdrawalRequestHistory(query) {
    try {
        if (query) {
            const response = await Axios.get(`${apiUrl}/get-all-withdrawal-requests${query}`);
            return response?.data;
        } else {
            const response = await Axios.get(`${apiUrl}/get-all-withdrawal-requests`);
            return response?.data;
        }
        
    } catch (error) {
        return error?.response?.data
    }
}

export async function getFundHistory(query) {
    try {
          if (query) {
        const response = await Axios.get(`${apiUrl}/get-user-transactions/${query}`);
        return response?.data;
    } else {
        const response = await Axios.get(`${apiUrl}/get-user-transactions`);
        return response?.data;
    }
    } catch (error) {
        return error?.response?.data
    }
  

}

export const approveFundRequest = (id, payload) => {
  return Axios.patch(`${apiUrl}/approve-fund-request/${id}`, payload);
};

export const rejectFundRequest = (id, payload) => {
  return Axios.patch(`${apiUrl}/reject-fund-request/${id}`, payload);
};

export const approveWithdrawalRequest = (id, payload) => {
  return Axios.put(`${apiUrl}/approve/${id}`, payload); // Correct route
};

export const rejectWithdrawalRequest = (id, payload) => {
  return Axios.put(`${apiUrl}/reject/${id}`, payload); // Correct route
};




export async function updateOrderStatus(id, status) {
    try {
           if (id && status) {
        const response = await Axios.put(`${apiUrl}/get-update-order-status/${id}`, { orderStatus: status });
        return response?.data;
    }
    } catch (error) {
        return error?.response?.data
    }
 
}


export async function getOrderSummary(data) {
    try {
        const response = await Axios.post(`${apiUrl}/get-order-summary`, data);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
} 

export async function teamSale() {
    try {
        const response = await Axios.get(`${apiUrl}/get-downline-summary`);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
}

export async function getRankHistoryMQ(query) {
    try {
          if(query){
        const response = await Axios.get(`${apiUrl}/get-rank-history/MQ${query}`);
        return response?.data;
    }else {
        const response = await Axios.get(`${apiUrl}/get-rank-history/MQ`);
        return response?.data;
    }
    } catch (error) {
        return error?.response?.data
    }
  
}

export async function getIncomeHistory(query) {
    try {
          if (query) {
        const response = await Axios.get(`${apiUrl}/get-user-income-history/${query}`);
        return response?.data;
    } else {
        const response = await Axios.get(`${apiUrl}/get-user-income-history`);
        return response?.data;
    }
    } catch (error) {
        return error?.response?.data
    }
  

}

export async function getRankHistoryDU(query) {
    try {
         if(query){
        const response = await Axios.get(`${apiUrl}/get-rank-history/DU${query}`);
        return response?.data;
    }else {
        const response = await Axios.get(`${apiUrl}/get-rank-history/DU`);
        return response?.data;
    }
    } catch (error) {
        return error?.response?.data
    }
   
}

export async function updateMQDURank(id, status) {
    try {
        if (id && status) {
            const response = await Axios.put(`${apiUrl}/rank-accept/${id}`, { status: status });
            return response?.data;
        }
    } catch (error) {
        return error?.response?.data
    }
}

export async function getOrderInvoice(id) {
    try {
  const response = await Axios.get(`${apiUrl}/get-order-invoice/${id}`);
  return response?.data;
  } catch (error) {
    return error?.response?.data
  }
}

export async function currentMonthSale() {
    try {
        const response = await Axios.get(`${apiUrl}/get-current-month-sales`);
        return response?.data;
        
    } catch (error) {
        return error?.response?.data
    }
}