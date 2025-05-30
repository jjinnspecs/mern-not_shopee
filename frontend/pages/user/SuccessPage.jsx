import { Box, Heading, Text, Button, useColorModeValue, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "../../src/store/cart";
import { useAuthStore } from "../../src/store/auth";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [error, setError] = useState(null);

  const { fetchCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const sourceId = searchParams.get('source_id');
      
      if (sourceId) {
        try {
          console.log("Verifying PayMongo payment...");
          const response = await fetch("/api/checkout/payment-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sourceId })
          });
          
          const data = await response.json();
          if (data.success) {
            setOrderCreated(true);
            console.log("Payment confirmed for order:", data.orderId);
          } else {
            setError(data.error || "Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          setError("Failed to verify payment");
        }
      } else {
        setOrderCreated(true);
      }
      
      if (user) {
        fetchCart(user._id);
      }
      
      setIsProcessing(false);
    };

    handlePaymentSuccess();
  }, [searchParams, user, fetchCart]);

  if (isProcessing) {
    return (
      <Box maxW="md" mx="auto" mt={16} p={8} borderRadius="lg" textAlign="center" bg={bgColor} textColor={textColor}>
        <Spinner size="xl" color="blue.500" mb={4} />
        <Heading color="blue.600" mb={4}>Processing Payment...</Heading>
        <Text>Please wait while we verify your payment.</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="md" mx="auto" mt={16} p={8} borderRadius="lg" textAlign="center" bg={bgColor} textColor={textColor}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button colorScheme="red" onClick={() => navigate("/cart")}>
          Back to Cart
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderRadius="lg" textAlign="center" bg={bgColor} textColor={textColor}>
      <Heading color="green.600" mb={4}>Payment Successful!</Heading>
      <Text mb={6}>Thank you for your purchase. Your order has been placed successfully.</Text>
      <Button colorScheme="teal" onClick={() => navigate("/orders")} mr={4}>
        View Orders
      </Button>
      <Button variant="outline" onClick={() => navigate("/")}>
        Continue Shopping
      </Button>
    </Box>
  );
};

export default SuccessPage;
