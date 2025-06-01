import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuthStore} from "../../src/store/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const { user: storeUser, token: storeToken } = useAuthStore();

  const navigate = useNavigate();
  useEffect(() => {
  const token = storeToken || localStorage.getItem("token");
  const user = storeUser || getStoredUser();

  if (!token || !user || user.role !== "admin") {
    navigate("/admin/login");
  }
}, [navigate, storeToken, storeUser]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");


  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // sample data
        setStats({
          totalProducts: 120,
          totalOrders: 58,
          totalCategories: 9,
          totalUsers: 300,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ label, value, help }) => (
    <Stat
      p={5}
      shadow="md"
      bg={cardBg}
      border="1px"
      borderColor={cardBorder}
      borderRadius="xl"
    >
      <StatLabel fontWeight="medium">{label}</StatLabel>
      <StatNumber fontSize="2xl" fontWeight="bold">
        {value}
      </StatNumber>
      {help && <StatHelpText>{help}</StatHelpText>}
    </Stat>
  );

  return (
    <Box px={6} py={8}>
      <Heading mb={6} size="lg">
        Welcome, Admin!
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Categories" value={stats.totalCategories} />
        <StatCard label="Registered Users" value={stats.totalUsers} />
      </SimpleGrid>

      <Box mt={10}>
        <Heading size="md" mb={2}>
          Overview
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Use the navigation above to manage products, categories, orders, and settings.
        </Text>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
