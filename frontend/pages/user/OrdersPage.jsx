import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useAuthStore } from "../../src/store/auth";
import { useOrderStore } from "../../src/store/order";
import { formatDate } from "../../src/utils/dateUtils";

const OrdersPage = () => {

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orders, loading, error, fetchUserOrders } = useOrderStore();

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const orderBgColor = useColorModeValue("gray.100", "gray.700");

  const statuses = ["All", "Pending Payment", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    if (user?._id) fetchUserOrders(user._id);
  }, [user, fetchUserOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "yellow";
      case "Shipped":
        return "blue";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const filteredOrders =
    selectedStatus === "All" ? orders : orders.filter((order) => order.status === selectedStatus);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil((sortedOrders.length || 0) / itemsPerPage);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsViewDetailsOpen(true);
  };

  const handleCloseViewDetails = () => {
    setIsViewDetailsOpen(false);
    setSelectedOrder(null);
  };

  

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading orders...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user?._id) {
    return (
      <Container maxW="container.md" p={4}>
        <VStack spacing={6}>
          <Heading size="lg" color="teal.500" textAlign="center">
            My Orders
          </Heading>
          <Text>You must be logged in to view your orders.</Text>
          <Button colorScheme="teal" onClick={() => navigate("/user/login")}>
            Login
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="teal.500" textAlign="center">
          My Orders
        </Heading>

        <Tabs
          isFitted
          variant="enclosed"
          onChange={(index) => {
            setSelectedStatus(statuses[index]);
            setCurrentPage(1);
          }}
        >
          <Box overflowX="auto" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
            <TabList minW="max-content" w="100%" gap={2} px={1} whiteSpace="nowrap">
              {statuses.map((status) => (
                <Tab key={status} fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 4 }}>
                  {status}
                </Tab>
              ))}
            </TabList>
          </Box>
        </Tabs>

        {filteredOrders.length === 0 ? (
          <Center py={12} flexDirection="column" textColor={textColor} bg={bgColor}>
            <Icon as={FaBoxOpen} boxSize={16} mb={4} />
            <Text fontSize="lg" fontWeight="medium">
              No orders yet.
            </Text>
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                getStatusColor={getStatusColor}
                bgColor={bgColor}
                textColor={textColor}
                onView={handleViewDetails}
              />
            ))}
          </VStack>
        )}

        <Text mt={4} textAlign="center" color="gray.600">
          Page {currentPage} of {totalPages}
        </Text>
        <Flex justify="center" mt={4} gap={2} wrap="wrap">
          <Button
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              size="sm"
              variant={currentPage === index + 1 ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </Flex>

        <Modal isOpen={isViewDetailsOpen} onClose={handleCloseViewDetails} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOrder ? (
                <Box>
                  <Text fontWeight="bold">
                    Order ID: #{selectedOrder._id.slice(-8).toUpperCase()}
                  </Text>
                  <Text>Order date: {formatDate(selectedOrder.createdAt)}</Text>
                  <Text>
                    Status:{" "}
                    <Badge colorScheme={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </Text>
                  <Text mt={3} mb={1}>Items:</Text>
                  <VStack align="start" spacing={2}>
                    {selectedOrder.items.map((item, idx) => (
                      <HStack key={idx} spacing={3}>
                        <Image
                          src={item.product?.image}
                          boxSize="40px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <Text fontSize="sm">
                          {item.product?.name} × {item.quantity}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                  <Divider my={3} />
                  <Text fontSize="sm">Payment Method: {selectedOrder.paymentMethod}</Text>
                  <Text fontSize="sm">Delivery Address: {selectedOrder.deliveryAddress}</Text>
                  <Text fontSize="md" fontWeight="bold" mt={2}>
                    Total: ₱{" "}
                    {Number(selectedOrder.total).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </Box>
              ) : (
                <Text>No order selected.</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCloseViewDetails}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

const OrderCard = ({ order, getStatusColor, bgColor, textColor, onView }) => {
  const itemBgColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Card textColor={textColor} bg={bgColor}>
      <CardBody>
        <VStack spacing={2} align="stretch">
          <HStack justify="end">
            <Badge colorScheme={getStatusColor(order.status)} px={3} py={1}>
              {order.status}
            </Badge>
          </HStack>

          <VStack spacing={2} align="stretch">
            {order.items.map((item, index) => (
              <HStack
                key={item._id || index}
                spacing={4}
                p={3}
                borderRadius="md"
                bg={itemBgColor}
              >
                <Image
                  src={item.product?.image || "placeholder-image.jpg"}
                  alt={item.product?.name || "Product"}
                  boxSize="60px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack spacing={1} flex={1} align="start">
                  <Text fontWeight="medium" fontSize="sm">
                    {item.product?.name || "Product Name"}
                  </Text>
                  <HStack spacing={4} fontSize="sm">
                    <Text>Qty: {item.quantity}</Text>
                    <Text>
                      ₱{" "}
                      {Number(item.price).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </VStack>

          <HStack justify="end" fontSize="sm">
            <VStack align="end" spacing={1}>
              <Text color="gray.500">Total Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                ₱{" "}
                {Number(order.total).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </VStack>
          </HStack>

          <Button size="sm" colorScheme="teal" alignSelf="flex-end" onClick={() => onView(order)}>
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default OrdersPage;
