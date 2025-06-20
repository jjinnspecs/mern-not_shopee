import { useState } from "react";
import { useAuthStore } from "../src/store/auth";
import {
  Container,
  Heading,
  Box,
  Input,
  Button,
  VStack,
  useToast,
  Stack,
  Text,
} from "@chakra-ui/react";

const UserRequestOtp = ({ onOtpRequested }) => {
  const requestUserOtp = useAuthStore((state) => state.requestUserOtp);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const Toast = useToast();

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    const data = await requestUserOtp(email);
    if (!data.success) {
      Toast({
        title: "Error",
        description: data.message || "Failed to send OTP.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      Toast({
        title: "OTP sent!",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onOtpRequested(email);
    }
  };

  return (
    <Container maxW="md" py={{ base: 6, md: 10 }}>
      <VStack spacing={8} align="stretch">
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          textAlign="center"
          color="teal.500"
        >
          User Login
        </Heading>

        <form onSubmit={handleRequest}>
          <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="md"
              required
            />
            <Button
              disabled={!email}
              type="submit"
              colorScheme="teal"
              size="md"
              w={{ base: "full", sm: "auto" }}
              px={{ base: 6, sm: 8 }}
            >
              Request OTP
            </Button>
          </Stack>
        </form>

        {message && (
          <Text fontSize="sm" color="gray.600" textAlign="center">
            {message}
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default UserRequestOtp;
