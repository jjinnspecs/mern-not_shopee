import { Outlet } from "react-router-dom";
import { Box, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../Navbar";

const MainLayout = () => {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.800")}>
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default MainLayout;
