import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Routers } from "./constants/Routes";
import Register from "./pages/Register/Register";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductList from "./pages/AllProductList/ProductList";
import Login from "./pages/Login/Login";
import AddProduct from "./pages/AddProduct/AddProduct";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import ReferralManagement from "./pages/ReferralManagement";
import AllOrdersManagement from "./pages/AllOrdersManagement";
import AllEpinVouchers from "./pages/AllEpinVouchers";
import LevelIncomeDistribution from "./pages/LevelIncomeDistribution";
import AllWidthdrawal from "./pages/AllWidthdrawal";
import AddCategory from "./pages/AddProductManagement/AddCategory";
import Unpaid from "./pages/subItems/Unpaid";
import Modify from "./pages/subItems/Modify";
import DUC from "./pages/subItems/DUC";
import MQC from "./pages/subItems/MQC";
import FundHistory from "./pages/subItems/FundHistory";
import FundRequest from "./pages/subItems/FundRequest";
import WalletHolder from "./pages/subItems/WalletHolder";
import AddFund from "./pages/subItems/AddFund";
import TeamSale from "./pages/subItems/TeamSale";
import OrderHistory from "./pages/subItems/OrderHistory";
import OrderSummary from "./pages/subItems/OrderSummary";
import PayoutManager from "./pages/subItems/PayoutManager";
import TransactionReport from "./pages/subItems/TransactionReport";
import Summary from "./pages/subItems/Summary";
import ProductSummary from "./pages/subItems/ProductSummary";
import CreateDistributor from "./pages/CreateDistributor";
import ProfileUpdate from "./pages/ProfileUpdate";
import AllUsers from "./pages/subItems/AllUsers";
import ViewProfile from "./pages/ViewProfile";
import AddNews from "./pages/News/AddNews";
import Invoice from "./pages/Invoice/Invoice";
import IncomeHistory from "./pages/IncomeHistory";
import TodayOrderHistory from "./pages/subItems/TodayOrderHistory";
import TodayDeposit from "./pages/subItems/TodayDeposit";
import CurrentMonthSale from "./pages/subItems/CurrentMonthSale";
import EditProduct from "./pages/AddProductManagement/EditProduct";
import EditProductPage from "./pages/AddProductManagement/EditProductPage";
import AllFranchise from "./pages/subItems/AllFranchise";


const RoutersPages = () => {
  const token = localStorage.getItem("token");
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {token === null || token === "" || token === undefined ? (
          <>
            <Route path={Routers.Login} element={<Login />} />
            <Route path={Routers.Register} element={<Register />} />
            <Route path="*" element={<Navigate to={Routers.Login} replace />} />
          </>
        ) : (
          <>
            <Route path={Routers.Dashboard} element={<Layout />}>
              <Route index element={<Dashboard />} />

              <Route
                path={Routers.REFERRAL_MANAGEMENT}
                element={<ReferralManagement />}
              />

              <Route path={Routers.ProductList} element={<ProductList />} />

              <Route path={Routers.AddProduct} element={<AddProduct />} />
              <Route path={Routers.AllWidthdrawals} element={<AllWidthdrawal />} />


              {/* <Route path={Routers.AllUsers} element={<VendorManagement />} /> */}

              <Route path={Routers.AllOrders} element={<AllOrdersManagement />} />
              <Route path={Routers.AllEpinVouchers} element={<AllEpinVouchers />} />
              <Route path={Routers.LevelIncomeDistribution} element={<LevelIncomeDistribution />} />
              <Route path={Routers.CreateDistributors} element={<CreateDistributor />} />

              {/* routes added by vikas  */}
              <Route path={Routers.unpaid} element={<Unpaid />} />
              <Route path={Routers.modify} element={<Modify />} />
                <Route path={Routers.AllUsers} element={<AllUsers />} />
                <Route path={Routers.AllFranchise} element={<AllFranchise />} />
              <Route path={Routers.ViewProfile} element={<ViewProfile />} />
              <Route path={Routers.AddCategory} element={<AddCategory />} />
              <Route path={Routers.duc} element={<DUC />} />
              <Route path={Routers.mqc} element={<MQC />} />
                <Route path={Routers.productSummary} element={<ProductSummary />} />
                <Route path={Routers.EditProductPage} element={<EditProductPage />} />

              <Route path={Routers.addfund} element={<AddFund />} />
              <Route path={Routers.fundHistory} element={<FundHistory />} />
              <Route path={Routers.TodayDeposit} element={<TodayDeposit />} />
              <Route path={Routers.fundrequest} element={<FundRequest />} />
              <Route path={Routers.walletholder} element={<WalletHolder />} />
              <Route path={Routers.teamsale} element={<TeamSale />} />
              <Route path={Routers.orderhistory} element={<OrderHistory />} />
              <Route path={Routers.TodayOrderHistory} element={<TodayOrderHistory />} />
              <Route path={Routers.ordersummary} element={<OrderSummary />} />
              <Route path={Routers.CurrentMonthSale} element={<CurrentMonthSale />} />
              <Route path={Routers.PAYOUT_MANAGER} element={<PayoutManager />} />
              <Route path={Routers.TRANSACTION_REPORT} element={<TransactionReport />} />
              <Route path={Routers.summary} element={<Summary />} />
              <Route path={Routers.ProfileUpdate} element={<ProfileUpdate />} />
              <Route path={Routers.AddNews} element={<AddNews />} />
              <Route path={Routers.Invoice} element={<Invoice />} />
              <Route path={Routers.IncomeHistory} element={<IncomeHistory />} />
            </Route>
            <Route path={Routers.NotFound} element={<NotFound />} />
            <Route path="*" element={<Layout />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default RoutersPages;
