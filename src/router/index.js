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
import SellersList from "../Views/Admin/Sellers/SellersList.vue";
import ClientsList from "../Views/Admin/Clients/ClientsList.vue";
import MarketsList from "../Views/Admin/Markets/MarketsList.vue";
import CategoryList from "../Views/Admin/Category/CategoryList.vue";
import OrdersList from "../Views/Admin/Orders/OrdersList.vue";
import AdminComments from "../Views/Admin/Comments/AdminComments.vue";
import AddUser from '../Views/Admin/Users/AddUser.vue';
import EditUser from '../Views/Admin/Users/EditUser.vue';
import AddMarket from '../Views/Admin/Markets/AddMarket.vue';
import EditMarket from '../Views/Admin/Markets/EditMarket.vue';
import AddCategory from '../Views/Admin/Category/AddCategory.vue';
import EditCategory from '../Views/Admin/Category/EditCategory.vue';
import OverviewAdmin from '../Views/Admin/OverviewAdmin.vue';
import SettingAdmin from '../Views/Admin/SettingAdmin .vue';
import FollowersList from '../Views/Seller/Followers/FollowersList.vue';
import ProductsList from '../Views/Seller/Products/ProductsList.vue';
import AddProduct from '../Views/Seller/Products/AddProduct.vue';
import EditProduct from '../Views/Seller/Products/EditProduct.vue';
import CategorySellerList from "../Views/Seller/SellerCategory/CategorySellerList .vue";
import AddSellerCategory from '../Views/Seller/SellerCategory/AddSellerCategory.vue';
import UserComments from '../Views/Seller/UserComments.vue';
import ResetPassword from '../Views/Auth/ResetPassword.vue';
import ShoppingCart from "../Views/User/Cart.vue";
import CheckoutPay from "../Views/User/checkout.vue";
import UserProfile from "../Views/User/Profile.vue";
import MyOrders from "../Views/User/MyOrders.vue";

const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error('Unable to parse stored user', error);
        return null;
    }
};

const defaultRouteForRole = (role) => {
    switch ((role || '').toLowerCase()) {
        case 'admin':
            return '/admin';
        case 'seller':
            return '/seller';
        default:
            return '/';
    }
};
const routes = [
    { path: '/sign-in', component: SignIn, name: 'SignIn', meta: { layout: 'AuthLayout' } },
    { path: '/sign-up', component: SignUp, name: 'SignUp', meta: { layout: 'AuthLayout' } },
    { path: '/resetPass', component: ResetPassword, meta: { layout: 'AuthLayout' } },
    { path: '/home', name: 'RoleHome', redirect: () => defaultRouteForRole(getStoredUser()?.role) },
    { path: '/', component: HomeUser, meta: { layout: 'DefaultLayout' } },
    { path: '/catalog', component: Catalog, meta: { layout: 'DefaultLayout' } },
    { path: '/wishlist', component: WishList, meta: { layout: 'DefaultLayout' } },
    { path: '/following-market', component: FollowingMarket, meta: { layout: 'DefaultLayout', requiresAuth: true, roles: ['client'] } },
    { path: '/shop-single/:id', component: ShopSingle, meta: { layout: 'DefaultLayout' } },
    { path: '/market-page/:sellerId', name: 'SellerStore', component: MarketPage, meta: { layout: 'DefaultLayout' } },
    { path: '/profile', component: UserProfile, meta: { layout: 'DefaultLayout', requiresAuth: true } },
    { path: '/my-orders', component: MyOrders, meta: { layout: 'DefaultLayout', requiresAuth: true, roles: ['client'] } },
    { path: '/admin', component: AdminDashboard, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/seller', component: SellerDashboard, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/sellers', component: SellersList, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/clients', component: ClientsList, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/addSeller', component: AddUser, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/editSeller/:id', component: EditUser, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/markets', component: MarketsList, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/category', component: CategoryList, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/admin/comments', component: AdminComments, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/orders', component: OrdersList, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/editClient/:id', component: EditUser, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/addMarket', component: AddMarket, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/editMarket/:id', component: EditMarket, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/addCategory', component: AddCategory, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/editCategory/:id', component: EditCategory, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/overviewAdmin', component: OverviewAdmin, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/settingAdmin', component: SettingAdmin, meta: { layout: 'AdminLayout', requiresAuth: true, roles: ['admin'] } },
    { path: '/followers', component: FollowersList, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/products', component: ProductsList, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/addProduct', component: AddProduct, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/editProduct/:id', component: EditProduct, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/sellerCategory', component: CategorySellerList, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/addSellerCategory', component: AddSellerCategory, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/comments', component: UserComments, meta: { layout: 'SellerLayout', requiresAuth: true, roles: ['seller'] } },
    { path: '/cart', component: ShoppingCart, meta: { layout: 'DefaultLayout' } },
    { path: '/checkout', component: CheckoutPay, meta: { layout: 'DefaultLayout' } },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const currentUser = getStoredUser();
    const role = currentUser?.role?.toLowerCase();

    // redirect authenticated users away from auth pages
    if (currentUser && (to.name === 'SignIn' || to.name === 'SignUp')) {
        next(defaultRouteForRole(role));
        return;
    }

    if (to.path === '/' && currentUser) {
        const targetHome = defaultRouteForRole(role);
        if (targetHome !== to.path) {
            next(targetHome);
            return;
        }
    }

    if (to.meta.requiresAuth && !currentUser) {
        next({ path: '/sign-in', query: { redirect: to.fullPath } });
        return;
    }

    if (to.meta.roles && to.meta.roles.length) {
        const allowed = to.meta.roles.map(r => r.toLowerCase());
        if (!role || !allowed.includes(role)) {
            next(defaultRouteForRole(role));
            return;
        }
    }

    next();
});

export default router;
