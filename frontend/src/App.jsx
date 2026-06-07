import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Orders = lazy(() => import('./pages/dashboard/Orders'));
const OrderDetail = lazy(() => import('./pages/dashboard/OrderDetail'));
const Addresses = lazy(() => import('./pages/dashboard/Addresses'));
const Wishlist = lazy(() => import('./pages/dashboard/Wishlist'));
const ChangePassword = lazy(() => import('./pages/dashboard/ChangePassword'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCustomerDetail = lazy(() => import('./pages/admin/AdminCustomerDetail'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Profile />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="addresses" element={<Addresses />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="password" element={<ChangePassword />} />
                  </Route>
                </Route>

                <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:id" element={<AdminProductForm />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="customers/:id" element={<AdminCustomerDetail />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'glass !bg-zinc-900/90 !text-white !border !border-zinc-700/50',
                duration: 3000,
              }}
            />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
