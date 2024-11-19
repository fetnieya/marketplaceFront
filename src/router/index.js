import { createRouter, createWebHistory } from "vue-router";

import HomeUser from "../Views/Home.vue";
import Catalog from "../Views/Catalog.vue";
import WishList from "../Views/WishList.vue";
import FollowingMarket from "../Views/FollowingMarket.vue";
import ShopSingle from "../Views/ShopSingle.vue";
import MarketPage from "../Views/MarketPage.vue";
import SignIn from "../Views/SignIn.vue";
import SignUp from "../Views/SignUp.vue";
import AdminDashboard from "../Views/AdminDashboard.vue";
import SellerDashboard from "../Views/SellerDashboard.vue";
import UsersList from "../Views/UsersList.vue";
import MarketsList from "../Views/MarketsList.vue";
import CategoryList from "../Views/CategoryList.vue";
import AddUser from '../Views/AddUser.vue';
import EditUser from '../Views/EditUser.vue';
import AddMarket from '../Views/AddMarket.vue';
import EditMarket from '../Views/EditMarket.vue';
import AddCategory from '../Views/AddCategory.vue';
import EditCategory from '../Views/EditCategory.vue';
import OverviewAdmin from '../Views/OverviewAdmin.vue';
import SettingAdmin from '../Views/SettingAdmin .vue';
import FollowersList from '../Views/FollowersList.vue';
import ProductsList from '../Views/ProductsList.vue';
import AddProduct from '../Views/AddProduct.vue';
import EditProduct from '../Views/EditProduct.vue';
import CategorySellerList from "../Views/CategorySellerList .vue";
import AddSellerCategory from '../Views/AddSellerCategory.vue';
import EditSellerCategory from '../Views/EditSellerCategory .vue';
import UserComments from '../Views/UserComments.vue';





const routes = [
    { path: '/', component: HomeUser, meta: { layout: 'DefaultLayout' } },
    { path: '/catalog', component: Catalog, meta: { layout: 'DefaultLayout' } },
    { path: '/wishlist', component: WishList, meta: { layout: 'DefaultLayout' } },
    { path: '/following-market', component: FollowingMarket, meta: { layout: 'DefaultLayout' } },
    { path: '/shop-single', component: ShopSingle, meta: { layout: 'DefaultLayout' } },
    { path: '/market-page', component: MarketPage, meta: { layout: 'DefaultLayout' } },
    { path: '/sign-in', component: SignIn, meta: { layout: 'AuthLayout' } },
    { path: '/sign-up', component: SignUp, meta: { layout: 'AuthLayout' } },
    { path: '/admin', component: AdminDashboard, meta: { layout: 'AdminLayout' } },
    { path: '/seller', component: SellerDashboard, meta: { layout: 'SellerLayout' } },
    { path: '/users', component: UsersList, meta: { layout: 'AdminLayout' } },
    { path: '/markets', component: MarketsList, meta: { layout: 'AdminLayout' } },
    { path: '/category', component: CategoryList, meta: { layout: 'AdminLayout' } },
    { path: '/addUser', component: AddUser, meta: { layout: 'AdminLayout' } },
    { path: '/editUser', component: EditUser, meta: { layout: 'AdminLayout' } },
    { path: '/addMarket', component: AddMarket, meta: { layout: 'AdminLayout' } },
    { path: '/editMarket', component: EditMarket, meta: { layout: 'AdminLayout' } },
    { path: '/addCategory', component: AddCategory, meta: { layout: 'AdminLayout' } },
    { path: '/editCategory', component: EditCategory, meta: { layout: 'AdminLayout' } },
    { path: '/overviewAdmin', component: OverviewAdmin, meta: { layout: 'AdminLayout' } },
    { path: '/settingAdmin', component: SettingAdmin, meta: { layout: 'AdminLayout' } },
    { path: '/followers', component: FollowersList, meta: { layout: 'SellerLayout' } },
    { path: '/products', component: ProductsList, meta: { layout: 'SellerLayout' } },
    { path: '/addProduct', component: AddProduct, meta: { layout: 'SellerLayout' } },
    { path: '/editProduct', component: EditProduct, meta: { layout: 'SellerLayout' } },
    { path: '/sellerCategory', component: CategorySellerList, meta: { layout: 'SellerLayout' } },
    { path: '/addSellerCategory', component: AddSellerCategory, meta: { layout: 'SellerLayout' } },
    { path: '/editSellerCategory', component: EditSellerCategory, meta: { layout: 'SellerLayout' } },
    { path: '/comments', component: UserComments, meta: { layout: 'SellerLayout' } },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;