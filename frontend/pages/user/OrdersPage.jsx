import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Badge,
    Image,
    Divider,
    Spinner,
    Alert,
    AlertIcon,
   Center,
   useColorModeValue,
   Icon,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuthStore } from "../../src/store/auth";
import { useOrderStore } from "../../src/store/order";
import { formatDate } from "../../src/utils/dateUtils";
import { FaBoxOpen } from "react-icons/fa";

const OrdersPage = () => {
    const { user } = useAuthStore();
    const { orders, loading, error, fetchUserOrders } = useOrderStore();

    useEffect(() => {
        if (user?._id) {
            fetchUserOrders(user._id);
        }
    }, [user, fetchUserOrders]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "yellow";
            case  "Shipped":
                return "blue";
            case "Delivered":
                return "green";
            case "Cancelled":
                return "red";
            default:
                return "gray";
        }
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    
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

    return (
        <Container maxW="container.xl" py={8} role="main">
            <VStack spacing={6} align="stretch">
                <Heading size="lg" color="teal.500" align="center">
                    My Orders
                </Heading>

                {orders.length === 0 ? (
                    <Center py={12} flexDirection="column" textColor={textColor} bg={bgColor}>
                        <Icon as={FaBoxOpen} boxSize={16} mb={4} />
                        <Text fontSize="lg" fontWeight="medium">
                        You haven't placed any orders yet.
                        </Text>
                        <Text fontSize="md" mt={2} color="gray.400" maxW="400px" textAlign="center">
                        Start shopping to see your orders here!
                        </Text>
                    </Center>
        ): (
                    <VStack spacing={4} align="stretch">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order}
                            getStatusColor={getStatusColor}
                            bg={bgColor}
                            textColor={textColor}
                            />
                        ))}
                    </VStack>
                )}
            </VStack>
        </Container>
    );
}

const OrderCard = ({ order, getStatusColor, bgColor, textColor}) => {

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

      const currencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });
  
    return (
        <Card textColor={textColor} bg={bgColor}>
            <CardBody>
                <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" wrap="wrap">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm">
                            Order ID
                            </Text>
                            <Text fontWeight="bold" fontSize="sm">
                                #{order._id.slice(-8).toUpperCase()}
                            </Text>
                        </VStack>

                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm">
                                Order Date
                            </Text>
                            <Text fontSize="sm">
                                {formatDate(order.createdAt)}
                            </Text>
                        </VStack>
                        <Badge
                        colorScheme={getStatusColor(order.status)}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="full"
                        >
                            {order.status}
                        </Badge>
                    </HStack>

                    <Divider />

                    <VStack spacing={3} align="stretch">
                        <Text fontWeight="semibold">
                            Items Ordered
                        </Text>

                        {order.items.map((item, index) => (
                            <HStack key={index} spacing={4} p={3}
                            borderRadius="md" bg={useColorModeValue('gray.100', 'gray.800')}>
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
                                    ₱ {Number(item.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                </Text>
                    </HStack>
                        ))}
                    </VStack>

                <Divider />

                    <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.500">
                                Payment Method
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" textTransform="uppercase">
                                {formatPaymentMethod(order.paymentMethod)}
                            </Text>
                        </VStack>
                        
                        <VStack align="end" spacing={1}>
                            <Text fontSize="sm" color="gray.500">
                                Total Amount
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color="blue.600">
                                ₱ {Number(order.total).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </Text>
                        </VStack>
                    </HStack>

                    <Divider />

                    {order.deliveryAddress && (
                        <Box>
                            <Text fontSize="sm" mb={1}>
                                Delivery Address
                            </Text>
                            <Text fontSize="sm">
                                {order.deliveryAddress}
                            </Text>
                        </Box>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
};

export default OrdersPage;