import { Outlet, useLocation } from "react-router-dom";
import { Box, useColorModeValue } from "@chakra-ui/react";
import AdminNavbar from "../AdminNavbar";

const AdminLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/admin/login";
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.800")}>
        {!isLoginPage && <AdminNavbar />}
      <Outlet />
    </Box>
  );
};

export default AdminLayout;
