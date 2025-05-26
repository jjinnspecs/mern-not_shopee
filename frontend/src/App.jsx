import { Box, Button, useColorModeValue, } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

//Pages
import HomePage from "../pages/HomePage";
import CreatePage from "../pages/CreatePage";
import Navbar from "../components/Navbar";
//Category pages
import IndexCategory from "../pages/admin/category/IndexCategory";
import AddCategory from "../pages/admin/category/AddCategory";

//user
import UserLoginPage from "../pages/user/UserLoginPage";
import CartPage from "../pages/user/CartPage";

//admin
import IndexProducts from "../pages/admin/product/IndexProducts";

function App() {

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.800")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />

        {/* Category pages routes */}
        <Route path="/category" element={<IndexCategory />} />
        <Route path="/category/add" element={<AddCategory />} />
        <Route path="/user/login" element={<UserLoginPage />} />

        {/* admin routes */}
        <Route path="/admin/products" element={<IndexProducts />} />


        {/* user routes */}
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Box>
  )
}

export default App
