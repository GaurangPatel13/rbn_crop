import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import { FaHome, FaSignOutAlt, FaSortAmountDown, FaSortAmountUp, FaUserEdit, FaUserGraduate, FaWallet } from "react-icons/fa";
import { MainContent } from "../constants/mainContent";
import defaultProfile from "../assets/manageMembers/defaultProfile.png";
import { BiAddToQueue, BiMoneyWithdraw, BiShare, BiSolidShoppingBags } from "react-icons/bi";
import { FaUserGroup, FaUserPlus } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { FiChevronsLeft, FiChevronsRight, FiShoppingCart } from "react-icons/fi";
import PageLoader from "../components/ui/PageLoader";
import { useSelector } from "react-redux";
import { Routers } from "../constants/Routes";
import { RiInputCursorMove } from "react-icons/ri";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { MdOutlineCategory, MdOutlineRequestQuote } from "react-icons/md";
import { AiOutlineHistory } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";
import img from "../assets/images/bg.jpg";
import Footer1 from "../components/Footer1";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state.userInfo.userInfo);

  let page = location.pathname.split("/")[1];
  page = page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, " ");
  if (page.includes(" ")) {
    page = page
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  const menuItems = [
    {
      path: `${Routers.Dashboard}`,
      label: "Dashboard",
      icon: <FaHome size={16} />,
      // subRoutes: [],
    },
    {

      label: "All Users",
      icon: <FaUserGroup />,
      subRoutes: [
        { label: "All Users", path: `${Routers.AllUsers}`, icon: <FaUserGraduate size={16} /> },
        // { label: "Modify Users", path: `${Routers.modify}`, icon: <FaUserEdit size={16} /> },

      ],
    },
    {

      label: "Request Master",
      icon: <BiAddToQueue />,
      subRoutes: [
        { label: "MQC Request", path: `${Routers.mqc}`, icon: <MdOutlineRequestQuote size={16} /> },
        { label: "DUC Request", path: `${Routers.duc}`, icon: <MdOutlineRequestQuote size={16} /> },
      ],
    },
    {

      label: "Product Master",
      icon: <BiSolidShoppingBags />,
      subRoutes: [
        { label: "Add Product", path: `${Routers.AddProduct}`, icon: <FiShoppingCart size={16} /> },
        { label: "Add Category", path: `${Routers.AddCategory}`, icon: <MdOutlineCategory size={16} /> },
        { label: "Product Summary", path: `${Routers.productSummary}`, icon: <AiOutlineHistory size={16} /> },
      ],
    },
    {

      label: "Fund Master",
      icon: <BiShare />,
      subRoutes: [
        { label: "Add Fund", path: `${Routers.addfund}`, icon: <GiReceiveMoney size={16} /> },
        { label: "Fund Request", path: `${Routers.fundrequest}`, icon: <MdOutlineRequestQuote size={16} /> },
        { label: "Fund History", path: `${Routers.fundHistory}`, icon: <AiOutlineHistory size={16} /> },
        { label: "Wallet Holder ", path: `${Routers.walletholder}`, icon: <FaWallet size={16} /> },
      ],
    },
    {

      label: "Sales Master",
      icon: <GrMoney />,
      subRoutes: [
        { label: "Team Sale", path: `${Routers.teamsale}`, icon: <GiReceiveMoney size={16} /> },
        { label: "Order History", path: `${Routers.orderhistory}`, icon: <AiOutlineHistory size={16} /> },
        { label: "Order Summary", path: `${Routers.ordersummary}`, icon: <FiShoppingCart size={16} /> },
      ],
    },
    {

      label: "Payout Master",
      icon: <RiInputCursorMove />,
      subRoutes: [
        // { label: "Payout Manager", path: `${Routers.PAYOUT_MANAGER}`, icon: <TbReportMoney size={16} /> },
        { label: "Transaction Report", path: `${Routers.TRANSACTION_REPORT}`, icon: <AiOutlineHistory size={16} /> },
      ],
    },
    {
      path: Routers.AddNews,
      label: "Add News",
      icon: <FaUserPlus />,
      // subRoutes: [],
    },
    // {
    //   path: Routers.CreateDistributors,
    //   label: "Create Franchise",
    //   icon: <FaUserPlus />,
    //   // subRoutes: [],
    // },
    {
      label: "Franchise Master",
      icon: <FaUserPlus />,
      subRoutes: [
        { label: "All Franchise", path: `${Routers.AllFranchise}`, icon: <FaUserGraduate size={16} /> },
        { label: "Verify Franchise", path: `${Routers.modify}`, icon: <FaUserEdit size={16} /> },

      ],
    },
     {
      path: Routers.IncomeHistory,
      label: "Income History",
      icon: <FaSortAmountUp/>,
      // subRoutes: [],
    },
  ];

  const actionButtons = [
    {
      label: "Logout",
      icon: <FaSignOutAlt />,
      bgColor: "bg-bg-color",
      func: () => {
        localStorage.removeItem("token");
        navigate(Routers.Login);
        window.location.reload();
      },
    },
  ];

  return (
    <>
      {loading && <PageLoader />}
      <div style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} className="flex justify-end p-2 gap-4 w-full h-screen  bg-bg-color1">
        <div
          className={`absolute md:relative w-[280px] py-2 px-4 z-50 h-full bg-white  md:rounded-md flex duration-300 flex-col ${!isSidebarOpen ? "md:left-0 -left-full" : "md:-left-full left-0"
            }`}
        >
          <div className="py-4 text-center flex items-center justify-between w-full gap-4">
            <Link to={Routers.Dashboard}><img src={MainContent.logo} alt="Bionova Logo" className=" w-full h-20 object-contain" /></Link>
            <button
              onClick={toggleSidebar}
              className={`block md:hidden text-lg bg-bg-color text-white rounded-md p-1 ${!isSidebarOpen ? "hidden" : "block"
                }`}
            >
              <FiChevronsRight />
            </button>

            <button
              onClick={toggleSidebar}
              className={` text-lg bg-bg-color hover:hover-bg-bg-color text-white rounded-md p-1 ${isSidebarOpen ? "hidden" : "block"
                }`}
            >
              <FiChevronsRight />
            </button>
          </div>


          <div className=" text-sm">
            <p className="text-gray-400">MANAGEMENT</p>
          </div>

          <nav className="scrollbar-left flex-1 overflow-y-auto">
            <ul className="space-y-2 py-2 ">
              {menuItems.map(({ path, label, icon, subRoutes }) => {
                const isDashboard = path === Routers.Dashboard;
                const distributionForm = path === Routers.CreateDistributors;
                const addNews = path === Routers.AddNews;
                const incomeHistory = path === Routers.IncomeHistory;
                const isOpen = openMenu === label;

                return (
                  <li key={label}>
                    <button
                      onClick={() => {
                        if (isDashboard || distributionForm || addNews || incomeHistory) {
                          navigate(path);
                        } else {
                          setOpenMenu(openMenu === label ? "" : label);
                        }
                      }}
                      className={`flex items-center w-full justify-between gap-2 transition-all duration-300 rounded-2xl p-2 group text-xs ${(path === Routers.Dashboard ? location.pathname === Routers.Dashboard : location.pathname === path || location.pathname.startsWith(path))
                        ? "bg-bg-color text-white font-medium"
                        : "text-[#454751]/70 hover:bg-bg-color hover:text-white font-light"
                        }`}
                    >
                      <div className="flex items-center gap-2" >
                        <div
                          className={`p-2 rounded-lg transition-all duration-300 bg-gray-200 group-hover:bg-white
                            }`}
                        >
                          <span
                            className={`text-base transition-colors duration-300 ${location.pathname === path || location.pathname.startsWith(path)
                              ? "text-[#0f2027]"
                              : "group-hover:text-[#0f2027] text-[#454751]"
                              }`}
                          >
                            {icon}
                          </span>
                        </div>
                        <span>{label}</span>
                      </div>

                      {!isDashboard && !distributionForm && !addNews && !incomeHistory && (isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />)}
                    </button>


                    {!isDashboard && isOpen && (
                      <ul className="mt-1 ml-4 space-y-1 text-xs text-[#555] flex flex-col gap-2 ">
                        {subRoutes.map((sub) => (
                          <Link to={sub.path} onClick={() => setIsSidebarOpen(false)} >
                            <li key={sub.path} className={`py-3 px-4 flex items-center gap-2 rounded-full hover:bg-bg-color hover:text-white ${location.pathname.startsWith(sub.path) ? "bg-bg-color text-white" : ""}`}>
                              {sub.icon}   {sub.label}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="py-2 space-y-1">
            <p className="text-gray-400 text-sm">OTHERS</p>
            {actionButtons.map(({ label, icon, bgColor, func }, index) => (
              <div key={index} className="p-2">
                <button
                  onClick={func}
                  className="flex w-full items-center text-[#101616] gap-2 text-xs font-medium"
                >
                  <div className={`p-2 ${bgColor} hover:hover-bg-bg-color hover:transition-all hover:duration-1000 text-white rounded-lg text-base`}>{icon}</div>
                  {label}
                </button>
              </div>
            ))}
          </div>


        </div>
        <div
          className={`flex flex-col w-full h-full duration-200 ${isSidebarOpen ? "w-full" : "md:w-[calc(100%-280px)]"} flex-shrink-0
            }`}
        >
          <main className="overflow-y-auto px-2 flex flex-col gap-5">
            <header className="flex items-center justify-between bg-white p-2 rounded-md  w-full">
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={toggleSidebar}
                  className={`text-lg bg-bg-color text-white rounded-md p-1 ${!isSidebarOpen ? "hidden" : "block"
                    }`}
                >
                  <FiChevronsRight />
                </button>
                <button
                  onClick={toggleSidebar}
                  className={`block md:hidden text-lg bg-bg-color text-white rounded-md p-1 ${isSidebarOpen ? "hidden" : "block"
                    }`}
                >
                  <FiChevronsRight />
                </button>
                <div className="flex justify-between w-full items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-bg-color font-bold text-lg px-2">
                      {page || "Dashboard"}
                    </p>
                  </div>

                  <div className="flex">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 overflow-hidden rounded-md">
                          <img src={defaultProfile} alt="profile" className="h-full object-cover w-full" />
                        </div>
                        <div className="text-xs">
                          <p className="capitalize">{userInfo?.name || "Admin"}</p>
                          <p className="text-xs opacity-50 capitalize">{userInfo?.role || "Admin"}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </header>
            <Outlet />
            <Footer1 />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
