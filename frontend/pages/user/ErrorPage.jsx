import { Box, Heading, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bgColor = useColorModeValue('red.100', 'gray.800');
  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderRadius="lg" textAlign="center" bg={bgColor}>
      <Heading color="red.600" mb={4}>Payment Failed</Heading>
      <Text mb={6}>Sorry, your payment was not successful or was cancelled. Please try again.</Text>
      <Button colorScheme="red" onClick={() => navigate("/cart")}>
        Back to Cart
      </Button>
    </Box>
  );
};

export default ErrorPage;