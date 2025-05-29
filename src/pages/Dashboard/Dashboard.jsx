import { useEffect, useState } from "react";
import HeaderStats from "./HeaderStats";
import Footer1 from "../../components/Footer1";
import PageLoader from "../../components/ui/PageLoader";
import { FaUser } from "react-icons/fa";
import RecentOrders from "../RecentOrders";
import Button from "../../components/Button";
import { getDashboardDetails, getRecentOrders } from "../../api/admin-api";
import { Routers } from "../../constants/Routes";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      const response = await getRecentOrders();
      setData(response?.recentOrders);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total User",
      value: dashboardStats?.totalUsers || 0,
      symbol: "",
      // change: "+8%",
      status: "down",
      icon: <i class="ri-team-fill"></i>,
      path: Routers.AllUsers,
      pathstate:"All",
      detailsIcon: <i class="ri-arrow-right-s-line"></i>

    },
    {
      title: "Active User",
      value: dashboardStats?.activeUsers || 0,
      symbol: "",
      // change: "+8%",
      status: "down",
      icon: <i class="ri-team-fill"></i>,
      path: Routers.AllUsers,
      pathstate:"Active",
      detailsIcon: <i class="ri-arrow-right-s-line"></i>

    },
    {
      title: "In Active User",
      value: dashboardStats?.inactiveUsers || 0,
      symbol: "",
      // change: "+8%",
      status: "down",
      icon: <i class="ri-user-fill"></i>,
      path: Routers.AllUsers,
      pathstate:"In Active",
      detailsIcon: <i class="ri-arrow-right-s-line"></i>

    },
    {
      title: "Total Franchise",
      value: dashboardStats?.totalFranchises || 0,
      symbol: "",
      // change: "+8%",
      status: "down",
      icon: <i class="ri-team-fill"></i>,
      path: Routers.AllUsers,
      pathstate:"All",
      detailsIcon: <i class="ri-arrow-right-s-line"></i>

    },
    {
      title: "Active Franchise",
      value: dashboardStats?.activeFranchises || 0,
      symbol: "",
      // change: "+8%",
      status: "down",
      icon: <i class="ri-team-fill"></i>,
      path: Routers.AllUsers,
      pathstate:"Active",
      detailsIcon: <i class="ri-arrow-right-s-line"></i>

    },
    {
      title: "In Active Franchise",
      value: dashboardStats?.inactiveFranchises || 0,
      symbol: "",
      // change: "+8%",
      status: "down",
      icon: <i class="ri-user-fill"></i>,
      path: Routers.AllUsers,
      pathstate:"In Active",
      detailsIcon: <i class="ri-arrow-right-s-line"></i>

    },
    {
      title: "Today Sale",
      value: dashboardStats?.todaysShopping?.toFixed(2) || 0,
      symbol: "₹",
      // change: "+8%",
      status: "down",
      path: Routers.TodayOrderHistory, pathstate:  new Date().toISOString().slice(0, 10).split('-').reverse().join('/'),
      
      icon: <i class="ri-shopping-cart-fill"></i>,
    },
    {
      title: "Current Month Sale",
      value: dashboardStats?.currentMonthShopping?.toFixed(2) || 0,
      symbol: "₹",
      // change: "+8%",
      status: "down",
      path: Routers.CurrentMonthSale,
      icon: <i class="ri-shopping-cart-fill"></i>,
    },
    {
      title: "Total Shopping",
      value: dashboardStats?.totalShopping?.toFixed(2) || 0,
      symbol: "₹",
      // change: "+8%",
      status: "down",
      path: Routers.orderhistory,
      icon: <i class="ri-shopping-cart-fill"></i>,
    },
    {
      title: "Today Deposit Fund",
      value: dashboardStats?.todayDepositFund?.toFixed(2) || 0,
      symbol: "₹",
      // change: "+8%",
      status: "down",
      path: Routers.TodayDeposit,
      pathstate:  new Date().toISOString().slice(0, 10).split('-').reverse().join('/'),
      icon: <i class="ri-wallet-3-fill"></i>,
    },
    {
      title: "Total Deposit Fund",
      value: dashboardStats?.totalDepositFund?.toFixed(2) || 0,
      symbol: "₹",
      // change: "+8%",
      status: "down",
      path: Routers.fundHistory,
      icon: <i class="ri-wallet-3-fill"></i>,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardDetails();
      setDashboardStats(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);



  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-7">
        <HeaderStats data={stats} />
        <div className=" bg-white shadow-xl rounded-xl">
          <RecentOrders orderList={data}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
