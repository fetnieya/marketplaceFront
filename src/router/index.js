import { createRouter, createWebHistory } from "vue-router";

import HomeUser from "../Views/User/Home.vue";
import Catalog from "../Views/User/Catalog.vue";
import WishList from "../Views/User/WishList.vue";
import FollowingMarket from "../Views/User/FollowingMarket.vue";
import ShopSingle from "../Views/User/ShopSingle.vue";
import MarketPage from "../Views/User/MarketPage.vue";
import SignIn from "../Views/Auth/SignIn.vue";
import SignUp from "../Views/Auth/SignUp.vue";
import AdminDashboard from "../Views/Admin/AdminDashboard.vue";
import SellerDashboard from "../Views/Seller/SellerDashboard.vue";
import UsersList from "../Views/Admin/Users/UsersList.vue";
import MarketsList from "../Views/Admin/Markets/MarketsList.vue";
import CategoryList from "../Views/Admin/Category/CategoryList.vue";
import AddUser from '../Views/Admin/Users/AddUser.vue';
import EditUser from '../Views/Admin/Users/EditUser.vue';
import AddMarket from '../Views/Admin/Markets/AddMarket.vue';
import EditMarket from '../Views/Admin/Markets/EditMarket.vue';
import AddCategory from '../Views/Admin/Category/AddCategory.vue';
import EditCategory from '../Views/Admin/Category/EditCategory.vue';
import OverviewAdmin from '../Views/Admin/OverviewAdmin.vue';
import SettingAdmin from '../Views/Admin/SettingAdmin .vue';
import FollowersList from '../Views/Seller/FollowersList.vue';
import ProductsList from '../Views/Seller/Products/ProductsList.vue';
import AddProduct from '../Views/Seller/Products/AddProduct.vue';
import EditProduct from '../Views/Seller/Products/EditProduct.vue';
import CategorySellerList from "../Views/Seller/SellerCategory/CategorySellerList .vue";
import AddSellerCategory from '../Views/Seller/SellerCategory/AddSellerCategory.vue';
import EditSellerCategory from '../Views/Seller/SellerCategory/EditSellerCategory .vue';
import UserComments from '../Views/Seller/UserComments.vue';
import ResetPassword from '../Views/Auth/ResetPassword.vue';
import ShoppingCart from "../Views/User/Cart.vue";
const routes = [
    { path: '/sign-in', component: SignIn, meta: { layout: 'AuthLayout' } },
    { path: '/sign-up', component: SignUp, meta: { layout: 'AuthLayout' } },
    { path: '/resetPass', component: ResetPassword, meta: { layout: 'AuthLayout' } },
    { path: '/', component: HomeUser, meta: { layout: 'DefaultLayout' } },
    { path: '/catalog', component: Catalog, meta: { layout: 'DefaultLayout' } },
    { path: '/wishlist', component: WishList, meta: { layout: 'DefaultLayout' } },
    { path: '/following-market', component: FollowingMarket, meta: { layout: 'DefaultLayout' } },
    { path: '/shop-single', component: ShopSingle, meta: { layout: 'DefaultLayout' } },
    { path: '/market-page', component: MarketPage, meta: { layout: 'DefaultLayout' } },
    { path: '/admin', component: AdminDashboard, meta: { layout: 'AdminLayout' } },
    { path: '/seller', component: SellerDashboard, meta: { layout: 'SellerLayout' } },
    { path: '/users', component: UsersList, meta: { layout: 'AdminLayout' } },
    { path: '/markets', component: MarketsList, meta: { layout: 'AdminLayout' } },
    { path: '/category', component: CategoryList, meta: { layout: 'AdminLayout' } },
    { path: '/addUser', component: AddUser, meta: { layout: 'AdminLayout' } },
    { path: '/editUser/:id', component: EditUser, meta: { layout: 'AdminLayout' } },
    { path: '/addMarket', component: AddMarket, meta: { layout: 'AdminLayout' } },
    { path: '/editMarket/:id', component: EditMarket, meta: { layout: 'AdminLayout' } },
    { path: '/addCategory', component: AddCategory, meta: { layout: 'AdminLayout' } },
    { path: '/editCategory/:id', component: EditCategory, meta: { layout: 'AdminLayout' } },
    { path: '/overviewAdmin', component: OverviewAdmin, meta: { layout: 'AdminLayout' } },
    { path: '/settingAdmin', component: SettingAdmin, meta: { layout: 'AdminLayout' } },
    { path: '/followers', component: FollowersList, meta: { layout: 'SellerLayout' } },
    { path: '/products', component: ProductsList, meta: { layout: 'SellerLayout' } },
    { path: '/addProduct', component: AddProduct, meta: { layout: 'SellerLayout' } },
    { path: '/editProduct/:id', component: EditProduct, meta: { layout: 'SellerLayout' } },
    { path: '/sellerCategory', component: CategorySellerList, meta: { layout: 'SellerLayout' } },
    { path: '/addSellerCategory', component: AddSellerCategory, meta: { layout: 'SellerLayout' } },
    { path: '/editSellerCategory/:id', component: EditSellerCategory, meta: { layout: 'SellerLayout' } },
    { path: '/comments', component: UserComments, meta: { layout: 'SellerLayout' } },
    { path: '/cart', component: ShoppingCart, meta: { layout: 'DefaultLayout' } },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;