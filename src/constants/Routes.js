import AddCategory from "../pages/AddProductManagement/AddCategory";
import EditProductPage from "../pages/AddProductManagement/EditProductPage";
import LevelIncomeDistribution from "../pages/LevelIncomeDistribution";
import AllFranchise from "../pages/subItems/AllFranchise";


export const Routers = {
  Dashboard: "/",
  Login: "/login",
  Register: "/register",
  VendorRegister: "/vendor-register",
  ProductList: "/product-list",
  AddProduct: "/add-product",
  AllUsers: "/all-users",
  AllOrders: "/all-orders",
  LevelIncomeDistribution: "/level-income-distribution",

  NotFound: "*",
  AddProductManagement: "/add-product-management",

  VENDOR_DETAILS: "/vendor-details",
  ADD_COUPON: "/offer-management",
  REWARD_MANAGEMENT: "/reward-management",

  REFERRAL_MANAGEMENT: "/referral-management",
  AllEpinVouchers: "/all-epin-vouchers",
  AllWidthdrawals: "/all-withdrawals",
  AddCategory: "/add-category",
  unpaid: "/unpaid",
  modify: "/modify-users",
  rankUpgrade: "/rank-upgrade",
  mqc: "/MQ-Challenge-Request",
  duc: "/DU-challenge-request",
  productSummary: "/product-summary",
  addfund: "/add-fund",
  fundrequest: "/fund-request",
  fundHistory: "/fund-history",
  walletholder: "/wallet-holder",
  teamsale: "/team-sale",
  orderhistory: "/order-history",
  ordersummary: "/order-summary",
  PAYOUT_MANAGER: "/payout-manager",
  TRANSACTION_REPORT: "/transaction-report",
  summary: "/summary",
  CreateDistributors: "/create-franchise",
  ProfileUpdate: "/profile-update",
  ViewProfile: "/view-profile",
  AddNews: "/add-news",
  Invoice: "/user-dashboard/invoice/:id",
  IncomeHistory : "/income-history",
  TodayOrderHistory: "/today-order-history",
  TodayDeposit: "/today-deposit",
  CurrentMonthSale: "/current-month-sale",
  EditProductPage: "/edit-product",
  AllFranchise: "/all-franchise",
};

