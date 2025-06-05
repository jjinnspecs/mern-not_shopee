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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../src/store/auth";
import { useProductStore } from "../../src/store/product";
import { useOrderStore } from "../../src/store/order";
import { useCategoryStore } from "../../src/store/category";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user: storeUser, token: storeToken } = useAuthStore();
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchAllOrders, loading: ordersLoading, error: ordersError } = useOrderStore();
  const { categories, fetchCategories } = useCategoryStore();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper function to get stored user
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  };

  // authentication check
  useEffect(() => {
    const token = storeToken || localStorage.getItem("token");
    const user = storeUser || getStoredUser();

    if (!token || !user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [navigate, storeToken, storeUser]);

  // fetch all data when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // fetch all data concurrently
        const [productsResult, ordersResult, categoriesResult] = await Promise.allSettled([
          fetchProducts(),
          fetchAllOrders(),
          fetchCategories()
        ]);

        // check for any failures
        const failures = [];
        if (productsResult.status === 'rejected') failures.push('products');
        if (ordersResult.status === 'rejected') failures.push('orders');
        if (categoriesResult.status === 'rejected') failures.push('categories');

        if (failures.length > 0) {
          setError(`Failed to fetch: ${failures.join(', ')}`);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [fetchProducts, fetchAllOrders, fetchCategories]);

  // calculate dynamic stats
  const stats = {
    totalProducts: products?.length || 0,
    totalOrders: orders?.length || 0,
    totalCategories: categories?.length || 0,
    // Calculate total users from orders (unique customers)
    totalUsers: orders ? new Set(orders.map(order => order.userId || order.user?._id).filter(Boolean)).size : 0,
  };

  // calculate additional insights
  const getOrderInsights = () => {
    if (!orders || orders.length === 0) return null;
    
    const pendingOrders = orders.filter(order => 
      order.status === 'Pending Payment' || order.status === 'Processing'
    ).length;
    
    const completedOrders = orders.filter(order => 
      order.status === 'Completed' || order.status === 'Delivered'
    ).length;

    return { pendingOrders, completedOrders };
  };

  const orderInsights = getOrderInsights();

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

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

  // loading state
  if (isLoading || ordersLoading) {
    return (
      <Box px={6} py={8} display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
        <Text ml={4}>Loading dashboard data...</Text>
      </Box>
    );
  }

  return (
    <Box px={6} py={8}>
      <Heading mb={6} size="lg">
        Welcome, Admin!
      </Heading>

      {/* error alert */}
      {(error || ordersError) && (
        <Alert status="warning" mb={6} borderRadius="md">
          <AlertIcon />
          {error || ordersError}
        </Alert>
      )}

      {/* main stats grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          label="Total Products" 
          value={stats.totalProducts}
          help={stats.totalProducts === 0 ? "No products yet" : null}
        />
        <StatCard 
          label="Total Orders" 
          value={stats.totalOrders}
          help={orderInsights ? `${orderInsights.pendingOrders} pending` : null}
        />
        <StatCard 
          label="Categories" 
          value={stats.totalCategories}
          help={stats.totalCategories === 0 ? "No categories yet" : null}
        />
        <StatCard 
          label="Unique Customers" 
          value={stats.totalUsers}
          help={stats.totalUsers === 0 ? "No customers yet" : null}
        />
      </SimpleGrid>

      {/* additional order insights */}
      {orderInsights && stats.totalOrders > 0 && (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <StatCard 
            label="Pending Orders" 
            value={orderInsights.pendingOrders}
            help="Require attention"
          />
          <StatCard 
            label="Completed Orders" 
            value={orderInsights.completedOrders}
            help="Successfully fulfilled"
          />
          <StatCard 
            label="Completion Rate" 
            value={`${Math.round((orderInsights.completedOrders / stats.totalOrders) * 100)}%`}
            help="Orders completed"
          />
        </SimpleGrid>
      )}

      {/* overview section */}
      <Box mt={10}>
        <Heading size="md" mb={2}>
          Overview
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Use the navigation above to manage products, categories, orders, and settings.
        </Text>
        
        {/* quick status summary */}
        {stats.totalProducts === 0 && (
          <Text fontSize="sm" color="orange.500">
            💡 Get started by adding your first product and categories.
          </Text>
        )}
        
        {stats.totalOrders > 0 && orderInsights?.pendingOrders > 0 && (
          <Text fontSize="sm" color="blue.500">
            📋 You have {orderInsights.pendingOrders} pending orders that need attention.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
