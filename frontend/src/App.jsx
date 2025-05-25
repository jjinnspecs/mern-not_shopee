import { Box, Button, useColorModeValue, } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

//Pages
import HomePage from "../pages/HomePage";
import CreatePage from "../pages/CreatePage";
import Navbar from "../components/Navbar";
//Category pages
import IndexCategory from "../pages/category/IndexCategory";
import AddCategory from "../pages/category/AddCategory";

//user
import UserLoginPage from "../pages/user/UserLoginPage";

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
      </Routes>
    </Box>
  )
}

export default App
