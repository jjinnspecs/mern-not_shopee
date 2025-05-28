import { Box, Button, useColorModeValue, } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

//Pages
import HomePage from "../pages/HomePage";
import CreatePage from "../pages/admin/product/CreatePage";
import Navbar from "../components/Navbar";
//Category pages
import IndexCategory from "../pages/admin/category/IndexCategory";
import AddCategory from "../pages/admin/category/AddCategory";

//user
import UserLoginPage from "../pages/user/UserLoginPage";
import CartPage from "../pages/user/CartPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import SuccessPage from "../pages/user/SuccessPage";
import ErrorPage from "../pages/user/ErrorPage";

//admin
import IndexProducts from "../pages/admin/product/IndexProducts";

function App() {

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.800")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/create" element={<CreatePage />} />

        {/* Category pages routes */}
        <Route path="/admin/category" element={<IndexCategory />} />
        <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/user/login" element={<UserLoginPage />} />

        {/* admin routes */}
        <Route path="/admin/products" element={<IndexProducts />} />


        {/* user routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Box>
  )
}

export default App
