import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/store/auth";
import { useCartStore } from "../../src/store/cart";

const CartPage = () => {
  const { user, token } = useAuthStore();
  const { cart, fetchCart, removeFromCart, updateQuantity, loading } = useCartStore();

  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [quantities, setQuantities] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);

  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const cancelRef = useRef();

  const bgColor = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const checkoutTextColor = useColorModeValue("white", "black");

  useEffect(() => {
    if (user?._id) fetchCart(user._id);
  }, [user]);

  useEffect(() => {
    if (cart?.items) {
      const qtyMap = {};
      cart.items.forEach(item => {
        qtyMap[item.product._id] = item.quantity;
      });
      setQuantities(qtyMap);
    }
  }, [cart]);

  const handleQuantityChange = async (productId, change) => {
    const currentQty = quantities[productId] || 1;
    const newQty = Math.max(1, currentQty + change);
    setQuantities(prev => ({ ...prev, [productId]: newQty }));

    const res = await updateQuantity({
      userId: user._id,
      productId,
      quantity: newQty,
    });

    toast({
      title: res.success ? "Quantity updated" : "Error",
      description: res.message || "Failed to update quantity.",
      status: res.success ? "success" : "error",
      duration: 2000,
      isClosable: true,
    });
  };

  const confirmRemove = (productId) => {
    setSelectedProductId(productId);
    openAlert();
  };

  const handleRemove = async () => {
    const res = await removeFromCart({ userId: user._id, productId: selectedProductId });
    toast({
      title: res.success ? "Removed from cart" : "Error",
      description: res.message || "Failed to remove item.",
      status: res.success ? "success" : "error",
      duration: 2000,
      isClosable: true,
    });
    closeAlert();
    setSelectedProductId(null);
  };

  const grandTotal = cart?.items?.reduce(
    (sum, item) => sum + item.product.price * (quantities[item.product._id] || item.quantity),
    0
  ) || 0;

  if (!token || !user?._id) {
    return (
      <Container maxW="container.md" p={4}>
        <VStack spacing={6}>
          <Heading size="lg" color="teal.500" textAlign="center">My Cart</Heading>
          <Text>You must be logged in to view your cart.</Text>
          <Button colorScheme="teal" onClick={() => navigate("/user/login")}>
            Login
          </Button>
        </VStack>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading cart...</Text>
        </VStack>
      </Container>
    );
  }

const renderItem = (item) => {
  const qty = quantities[item.product._id] || item.quantity;
  const total = item.product.price * qty;

  return (
    <Card key={item.product._id} mb={4} bgColor={bgColor}>
      <CardBody position="relative" pb={6}>
        <Box position="absolute" top={2} right={2}>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => confirmRemove(item.product._id)}
          >
            <FaTrash />
          </Button>
        </Box>

        <Flex direction={{ base: "column", sm: "row" }} gap={4}>
          <Image
            src={item.product.image}
            alt={item.product.name}
            boxSize="80px"
            objectFit="cover"
            borderRadius="md"
            mx={{ base: "auto", sm: "0" }}
          />
          <Box flex="1" fontSize="sm">
            <Text fontWeight="bold" mb={1}>{item.product.name}</Text>
            <Text color="gray.500" mb={2}>
              ₱ {item.product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>

            <Flex justify="space-between" align="center">
              <HStack>
                <IconButton
                  icon={<MinusIcon />}
                  size="sm"
                  onClick={() => handleQuantityChange(item.product._id, -1)}
                  aria-label="Decrease quantity"
                  isDisabled={qty <= 1}
                />
                <Text>{qty}</Text>
                <IconButton
                  icon={<AddIcon />}
                  size="sm"
                  onClick={() => handleQuantityChange(item.product._id, 1)}
                  aria-label="Increase quantity"
                />
              </HStack>
              <Badge colorScheme="teal" p={2} borderRadius="md">
                ₱ {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};


  return (
    <Container maxW="container.lg" py={6}>
      <Heading size="lg" color="teal.600" mb={6} textAlign="center">My Cart</Heading>

      {!cart?.items?.length ? (
        <Box textAlign="center" bgColor={bgColor} py={10} borderRadius="md">
          <Text fontSize="lg">Your cart is empty.</Text>
        </Box>
      ) : (
        <>
          {isMobile
            ? cart.items.map(renderItem)
            : (
            <Box boxShadow="sm" borderRadius="md" bgColor={bgColor}>
              {/* Header */}
              <Flex p={4} fontWeight="bold" borderBottom="1px solid" borderColor={border} align="center">
                <Box w="50px" color={textColor}>#</Box>
                <Box w="100px" color={textColor}>Image</Box>
                <Box w="200px" color={textColor}>Product</Box>
                <Box w="120px" color={textColor}>Price</Box>
                <Box w="150px" color={textColor}>Quantity</Box>
                <Box w="120px" color={textColor}>Total</Box>
                <Box w="100px" color={textColor} textAlign="center"></Box>
              </Flex>

              {/* Rows */}
              {cart.items.map((item, idx) => {
                const qty = quantities[item.product._id] || item.quantity;
                const total = item.product.price * qty;

                return (
                  <Flex key={item.product._id} p={4} align="center" borderBottom="1px solid" borderColor={border}>
                    <Box w="50px">{idx + 1}</Box>
                    <Box w="100px">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </Box>
                    <Box w="200px">{item.product.name}</Box>
                    <Box w="120px">
                      ₱ {item.product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </Box>
                    <Box w="150px">
                      <Flex align="center">
                        <IconButton
                          icon={<MinusIcon />}
                          size="sm"
                          aria-label="Decrease quantity"
                          onClick={() => handleQuantityChange(item.product._id, -1)}
                          isDisabled={qty <= 1}
                          mr={2}
                        />
                        <Text>{qty}</Text>
                        <IconButton
                          icon={<AddIcon />}
                          size="sm"
                          aria-label="Increase quantity"
                          onClick={() => handleQuantityChange(item.product._id, 1)}
                          ml={2}
                        />
                      </Flex>
                    </Box>
                    <Box w="120px">
                      ₱ {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </Box>
                    <Box w="100px" textAlign="center">
                      <Button size="sm" colorScheme="red" onClick={() => confirmRemove(item.product._id)}>
                        Remove
                      </Button>
                    </Box>
                  </Flex>
                );
              })}
            </Box>

            )}

          <Flex justify="flex-end" mt={6}>
            <Box textAlign="right">
              <Text fontSize="lg" fontWeight="bold">Grand Total:</Text>
              <Text fontSize="lg" color="teal.500" fontWeight="bold">
                ₱ {grandTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Text>
              <Button
                mt={4}
                colorScheme="yellow"
                color={checkoutTextColor}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Flex>
        </>
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Item
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to remove this item from your cart?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRemove} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default CartPage;