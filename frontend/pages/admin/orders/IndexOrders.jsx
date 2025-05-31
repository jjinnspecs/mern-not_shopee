import {
    Container,
    Text,
    VStack,
    HStack,
    Input,
    Button,
    Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  TableContainer,
  Table,
  TableCaption,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tfoot,
    ButtonGroup,
    IconButton,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useColorModeValue,
    Heading,
    Flex,
    Select,
    Image,
    Badge,
    Box,
    Spinner,
    Alert,
    AlertIcon,
    Divider,
    Icon
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { useOrderStore } from "../../../src/store/order";
import { formatDate } from "../../../src/utils/dateUtils";
import { FaEdit, FaEye } from "react-icons/fa";

const IndexOrders = () => {

    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
    const toast = useToast();
    const cancelRef = useRef();

    const { orders, loading, error,  fetchAllOrders, updateOrderStatus } = useOrderStore();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editOrderId, setEditOrderId] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState("");

    // modal/alert dialog controls

    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose,
    } = useDisclosure();

    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();

    

       //pagination
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 4;
  
      const totalPages = Math.ceil(orders.length / itemsPerPage);
      const paginatedOrders = orders.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
      );

      useEffect(() => {
        fetchAllOrders();
      }, [fetchAllOrders]);

      //handlers
    const handleUpdateOrderStatus = async (orderId, status) => {
        if (!status) {
            toast({
                title: "Error",
                description: "Please select a status.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const { success, message } = await updateOrderStatus(orderId, status);
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onUpdateClose();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending Payment":
                return "gray";
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
    
    const formatPaymentMethod = (paymentMethod) => {
        switch (paymentMethod) {
            case 'cod':
                return 'Cash on Delivery';
            case 'gcash':
                return 'GCash';
            case 'grab_pay':
                return 'GrabPay';
            default:
                return paymentMethod?.toUpperCase() || 'Unknown';
        }
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
                </Alert>
            </Container>
        );
    }

      return (
        <Container maxW="container.xl" py={12}>
          <VStack spacing={8} align="stretch">
            <Heading as="h1"
             size={{base: "lg", md: "xl" }} 
             textAlign="center"
             mb={{ base: 2, md: 8 }}
             fontWeight="bold"
             color="teal.500"
             >
                Orders Management
            </Heading>
            </VStack>
            <TableContainer marginTop={8}>
              <Table variant="simple" bg={bgColor} color={textColor}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Order ID</Th>
                    <Th>Customer</Th>
                    <Th>Total Amount</Th>
                    <Th>Status</Th>
                    <Th>Payment Method</Th>
                    <Th>Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                    {paginatedOrders.map((order, idx) => (
                    <Tr key={order._id}>
                    <Td>{(currentPage - 1) * itemsPerPage + idx + 1}</Td>
                      <Td>{order._id.slice(-8).toUpperCase()}</Td>
                      <Td>{order.user?.email || order.user?._id}</Td>
                      <Td>{Number(order.total).toLocaleString("en-PH", { minimumFractionDigits: 2})}</Td>
                      <Td>
                        <Badge
                        colorScheme={getStatusColor(order.status)}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="md"
                        >{order.status}
                        </Badge>
                      </Td>
                      <Td>{formatPaymentMethod(order.paymentMethod)}</Td>
                      <Td>{formatDate(order.createdAt)}</Td>

                      <Td>
                        <ButtonGroup spacing={2}>
                            <IconButton
                            icon={<FaEye/>}
                            colorScheme="teal"
                            aria-label="View"
                            onClick={() => {
                                setSelectedOrder(order);
                                onViewOpen();
                            }}
                            />

                            <IconButton
                            icon={<FaEdit/>}
                            colorScheme="blue"
                            aria-label="Edit"
                            onClick={() => {
                                setEditOrderId(order._id);
                                setUpdatedStatus(order.status);
                                onUpdateOpen();
                            }}
                            />
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}

                  {/* if no orders */}
                  {orders.length === 0 && (
                    <Tr>
                        <Td colSpan={8}>
                            <Text textAlign="center">
                                No orders found.
                            </Text>
                        </Td>
                    </Tr>
                    )}

                     {/* Add empty rows if less than itemsPerPage */}
                        {Array.from({ length: Math.max(0, itemsPerPage - paginatedOrders.length) }).map((_, i) => (
                            <Tr key={`empty-${i}`}>
                                <Td colSpan={8} height="73px" bg="transparent"></Td>
                            </Tr>
                        ))}
                </Tbody>
              </Table>

        {/* Pagination Controls */}
        <Text mt={4} textAlign="center" color="gray.600">
          Page {currentPage} of {totalPages}
        </Text>
        <Flex justify="center" mt={6} gap={2}>
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
              onClick={() => setCurrentPage(index + 1)}>
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

        {/* Modal for Viewing Order Details */}
        <Modal isOpen={isViewOpen} onClose={onViewClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader align="center">Order Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {selectedOrder && (
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" wrap="wrap">
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Order ID</Text>
                                    <Text fontWeight="bold">
                                        #{selectedOrder._id.toUpperCase()}
                                    </Text>
                                </VStack>
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Order Date</Text>
                                    <Text>
                                        {formatDate(selectedOrder.createdAt)}
                                    </Text>
                                    </VStack>
                                <Badge
                                colorScheme={getStatusColor(selectedOrder.status)}
                                fontSize="sm"
                                px={3}
                                py={1}
                                borderRadius="full">
                                    {selectedOrder.status}
                                </Badge>
                            </HStack>
                            <Divider />
                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Customer Information
                                </Text>
                                <Text fontSize="sm">Email:{" "}
                                    {selectedOrder.user?.email || 'N/A'}
                                </Text>
                                 <Text fontSize="sm">Phone:{" "}
                                    {selectedOrder.phone}
                                </Text>
                                 <Text fontSize="sm">Delivery Address:{" "} {selectedOrder.deliveryAddress}
                                </Text>
                                </Box>

                                <Divider />
                                <VStack spacing={3} align="stretch">
                                    <Text fontWeight="semibold">
                                        Items Ordered
                                    </Text>
                                    {selectedOrder.items.map((item, index) => (
                                        <HStack key={index} spacing={4} p={3}
                                        borderRadius="md"
                                        bg={bgColor}>
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
                                            <HStack spacing={4}>
                                                <Text fontSize="sm">
                                                    Qty: {item.quantity}
                                                </Text>
                                            <Text fontSize="sm">
                                                ₱ {Number(item.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                            </Text>
                                            </HStack>
                                            </VStack>
                                            <Text fontWeight="semibold" color="blue.600">
                                                ₱ {Number(item.price * item.quantity).toLocaleString("en-PH", 
                                                    { minimumFractionDigits: 2 })}
                                            </Text>
                                        </HStack>
                                    ))}
                                    
                                </VStack>
                                <Divider />
<HStack justify="space-between">
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" color="gray.500">Payment Method</Text>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {formatPaymentMethod(selectedOrder.paymentMethod)}
                                            </Text>
                                        </VStack>
                                        <VStack align="end" spacing={1}>
                                            <Text fontSize="sm" color="gray.500">Total Amount</Text>
                                            <Text fontSize="xl" fontWeight="bold" color="blue.600">
                                                ₱ {Number(selectedOrder.total).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onViewClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Update Status Modal */}
                <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader align="center">Update Order Status</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4}>
                                <Text fontSize="sm" color="gray.500">
                                    Order ID: #{editOrderId?.slice(-8).toUpperCase()}
                                </Text>
                                <Select
                                    placeholder="Select Status"
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}>
                                    <option value="Pending Payment">Pending Payment</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Select>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                colorScheme="blue" 
                                mr={3} 
                                onClick={() => handleUpdateOrderStatus(editOrderId, updatedStatus)}>
                                Update
                            </Button>
                            <Button onClick={onUpdateClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </TableContainer>
        </Container>
    );
};
export default IndexOrders;