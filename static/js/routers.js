import admin from "./components/admin.js";
import Login from "./components/login.js";
import RegisterUser from "./components/Registeruser.js";
import PageNotFound from "./components/pagenotfound.js";
import user from "./components/userdashboard.js";
import manager from "./components/manager.js";
import LogoutComponent from "./logoutcomponent.js";
import Profile from "./components/profile.js";
import adminrequests from "./components/adminrequests.js";
import MProducts from "./components/mproducts.js";
import addcart from "./components/addcart.js";
import Cartpage from "./components/cartpage.js";
import searchbar from "./components/searchbar.js";
import Searchcategory from "./components/searchcategory.js";
import Summarypage from "./components/summarypage.js";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/logout",
    name: "LogoutComponent",
    component: LogoutComponent,
  },
  {
    path: "/admin",
    name: "Admin",
    component: admin,
  },
  {
    path: "/adminrequests",
    name: "adminrequests",
    component: adminrequests,
  },
  {
    path: "/",
    name: "User",
    component: user,
  },
  {
    path: "/manager",
    name: "manager",
    component: manager,
  },
  {
    path: "/managerprod/:cname/:cid",
    name: "MProducts",
    component: MProducts,
  },
  {
    path: "/register",
    name: "RegisterUser",
    component: RegisterUser,
  },
  {
    path:"/addcart/:pid",
    name: "addcart",
    component: addcart,
  },
  {
    path: "/cartpage",
    name: "Cartpage",
    component: Cartpage,
  },
  {
    path:"/search/:product_name",
    name:"searchbar",
    component: searchbar,
  },
  {
    path:"/summarypage",
    name:"Summarypage",
    component: Summarypage,
  },
  {
    path:"/searchcat/:category_name",
    name:"Searchcategory",
    component:Searchcategory,
  },
  {
    path: "*",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
