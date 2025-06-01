import { Route, Routes } from "react-router-dom";

// Layouts
import MainLayout from "../components/layouts/MainLayout";
import AdminLayout from "../components/layouts/AdminLayout";

// Pages
import HomePage from "../pages/HomePage";
import UserLoginPage from "../pages/user/UserLoginPage";
import CartPage from "../pages/user/CartPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import SuccessPage from "../pages/user/SuccessPage";
import ErrorPage from "../pages/user/ErrorPage";
import OrdersPage from "../pages/user/OrdersPage";
import PaymongoSuccessProxy from "../pages/user/PaymongoSuccessProxy";

import AdminLogin from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboardPage";
import IndexCategory from "../pages/admin/category/IndexCategory";
import AddCategory from "../pages/admin/category/AddCategory";
import IndexProducts from "../pages/admin/product/IndexProducts";
import CreatePage from "../pages/admin/product/CreatePage";
import IndexOrders from "../pages/admin/orders/IndexOrders";

import ProtectedRoute from "../components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/paymongo-success" element={<PaymongoSuccessProxy />} />
      </Route>

      {/* Admin layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute requiredRole="admin" />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/category" element={<IndexCategory />} />
        <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/admin/products" element={<IndexProducts />} />
        <Route path="/admin/create" element={<CreatePage />} />
        <Route path="/admin/orders" element={<IndexOrders  />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
