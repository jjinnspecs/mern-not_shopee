import { Box, Heading, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderRadius="lg" textAlign="center" bg={bgColor}
            textColor={textColor}>
      <Heading color="green.600" mb={4}>Payment Successful!</Heading>
      <Text mb={6}>Thank you for your purchase. Your order has been placed successfully.</Text>
      <Button colorScheme="teal" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Box>
  );
};

export default SuccessPage;