import {
  Container,
  Heading,
  VStack,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Image,
  Text,
  useToast,
  Box,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useCartStore } from "../../src/store/cart";
import { useAuthStore } from "../../src/store/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user, token } = useAuthStore();
  const { cart, fetchCart, removeFromCart, updateQuantity } = useCartStore();
  const Toast = useToast();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (user?._id) {
      fetchCart(user._id);
     }
  }, [user, fetchCart]);

  useEffect(() => {
    if (cart && cart.items) {
      const qty = {};
      cart.items.forEach(item => {
        qty[item.product._id] = item.quantity;
      });
      setQuantities(qty);
    }
  }, [cart]);

  if (!token || !user?._id) {
    return (
      <Container maxW="container.md" p={12}>
        <VStack spacing={8}>
          <Heading size="lg">Your Cart</Heading>
          <Text>You must be logged in to view your cart.</Text>
          <Button colorScheme="teal" onClick={() => navigate("/user/login")}>
            Login
          </Button>
        </VStack>
      </Container> 
    );
  }

  // Calculate grand total
  let grandTotal = 0;
  if (cart && cart.items) {
    grandTotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * (quantities[item.product._id] || item.quantity),
      0
    );
  }

  return (
    <Container maxW="container.xl" p={12}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size={{ base: "lg", md: "xl" }} 
        textAlign="center" mb={{ base: 2, md: 8 }}
        color="teal.500"
        >
          Your Cart
        </Heading>
      </VStack>
      <TableContainer marginTop={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th w={4}><Heading size={{ base: "sm", md: "md"}}>#</Heading></Th>
              <Th><Heading size={{ base: "sm", md: "md"}}>Image</Heading></Th>
              <Th><Heading size={{ base: "sm", md: "md"}}>Product Name</Heading></Th>
              <Th><Heading size={{ base: "sm", md: "md"}}>Price</Heading></Th>
              <Th><Heading size={{ base: "sm", md: "md"}}>Quantity</Heading></Th>
              <Th><Heading size={{ base: "sm", md: "md"}}>Total</Heading></Th>
              <Th><Heading size={{ base: "sm", md: "md"}}></Heading></Th>
            </Tr>
          </Thead>
          <Tbody>
            {cart && cart.items && cart.items.length > 0 ? (
              cart.items.map((item, idx) => (
                <Tr key={item.product._id}>
                  <Td>{idx + 1}</Td>
                  <Td>
                    <Image src={item.product.image} alt={item.product.name} boxSize="100px" objectFit="cover" />
                  </Td>
                  <Td>{item.product.name}</Td>
                  <Td>₱ {Number(item.product.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Td>
                  <Td>
                    <Flex align="center">
                      <IconButton
                        icon={<MinusIcon />}
                        size="sm"
                        aria-label="Decrease quantity"
                        onClick={async () => {
                          const newQty = Math.max(1, (quantities[item.product._id] || item.quantity) - 1);
                          setQuantities(qty => ({
                            ...qty,
                            [item.product._id]: newQty,
                          }));
                          if (newQty !== item.quantity && updateQuantity) {
                            const res = await updateQuantity({
                              userId: user._id,
                              productId: item.product._id,
                              quantity: newQty,
                            });
                            if (res.success) {
                              Toast({
                                title: "Quantity updated",
                                status: "success",
                                duration: 2000,
                                isClosable: true,
                              });
                            } else {
                              Toast({
                                title: "Error",
                                description: res.message || "Failed to update quantity.",
                                status: "error",
                                duration: 2000,
                                isClosable: true,
                              });
                            }
                          }
                        }}
                        isDisabled={quantities[item.product._id] <= 1}
                        mr={2}
                      />
                      <Text minW="30px" textAlign="center">
                        {quantities[item.product._id] || item.quantity}
                      </Text>
                      <IconButton
                        icon={<AddIcon />}
                        size="sm"
                        aria-label="Increase quantity"
                        onClick={async () => {
                          const newQty = (quantities[item.product._id] || item.quantity) + 1;
                          setQuantities(qty => ({
                            ...qty,
                            [item.product._id]: newQty,
                          }));
                          if (updateQuantity) {
                            const res = await updateQuantity({
                              userId: user._id,
                              productId: item.product._id,
                              quantity: newQty,
                            });
                            if (res.success) {
                              Toast({
                                title: "Quantity updated",
                                status: "success",
                                duration: 2000,
                                isClosable: true,
                              });
                            } else {
                              Toast({
                                title: "Error",
                                description: res.message || "Failed to update quantity.",
                                status: "error",
                                duration: 2000,
                                isClosable: true,
                              });
                            }
                          }
                        }}
                        ml={2}
                      />
                    </Flex>
                  </Td>
                 <Td>
                  ₱ {(item.product.price * (quantities[item.product._id] || item.quantity)).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      aria-label="Remove"
                      onClick={async () => {
                        const res = await removeFromCart({
                          userId: user._id,
                          productId: item.product._id,
                        });
                        if (res.success) {
                          Toast({
                            title: "Removed from cart",
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                          });
                        } else {
                          Toast({
                            title: "Error",
                            description: res.message || "Failed to remove item.",
                            status: "error",
                            duration: 2000,
                            isClosable: true,
                          });
                        }
                      }}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  Your cart is empty.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Box textAlign="right" mt={4}>
          <Text fontWeight="bold" fontSize="xl">
            Grand Total: ₱ {grandTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })
            .replace(/,/g, ", ")}
          </Text>
          {cart && cart.items && cart.items.length > 0 && (
            <Button
              colorScheme="orange"
              size="lg"
              mt={4}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          )}
        </Box>
      </TableContainer>
    </Container>
  );
};

export default CartPage;