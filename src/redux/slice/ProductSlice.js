import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addProductForm, getAllProducts, deleteProducts, editProduct, getAllCategories, getSubCategorybyCategory, updateStockStatus } from '../../api/admin-api';




export const fetchProducts = createAsyncThunk('admin/get-all-products', async () => {
  const response = await getAllProducts();
  return response.data;
});

export const addProduct = createAsyncThunk('admin/add-product', async (newProduct) => {
  const response = await addProductForm(newProduct);
  return response;
});

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id) => {
  const res = await deleteProducts(id);
  return id;
});

export const updateProduct = createAsyncThunk('product/updateProduct', async ({ id, updatedProduct }) => {
  const response = await editProduct(id, updatedProduct);
  return response?.data;
});


export const fetchCategories = createAsyncThunk('product/fetchCategories', async () => {
  const response = await getAllCategories();
  return response;
});

export const fetchSubCategory = createAsyncThunk('product/fetchSubCategory', async (category) => {
  const response = await getSubCategorybyCategory(category);
  return response;
});

export const toggleProductStock = createAsyncThunk(
  'product/toggleStock',
  async (id) => {
    await updateStockStatus(id);
    return id;
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
    categories: [],
    subcategories: []
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {

        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch
      .addCase(fetchSubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(toggleProductStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleProductStock.fulfilled, (state, action) => {
        const product = state.products.find(p => p._id === action.payload);
        if (product) {
          product.inStock = !product.inStock;
        }
        state.loading = false;
      })
      .addCase(toggleProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  },
});

export default productSlice.reducer;
