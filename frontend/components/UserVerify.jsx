import { useState } from "react";
import { useAuthStore } from "../src/store/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  Input,
  Button,
  VStack,
  useToast,
  Stack,
  Text,
} from "@chakra-ui/react";

const UserVerifyOtp = ({ email }) => {
  const verifyUserOtp = useAuthStore((state) => state.verifyUserOtp);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const Toast = useToast();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const data = await verifyUserOtp(email, otp);
    if (!data.success) {
      Toast({
        title: "Verification failed",
        description: data.message || "Invalid or expired OTP.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      Toast({
        title: "Login successful!",
        description: "You are now logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
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
          User Verification
        </Heading>

        <form onSubmit={handleVerify}>
          <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              size="md"
              required
            />
            <Button
              type="submit"
              colorScheme="teal"
              size="md"
              w={{ base: "full", sm: "auto" }}
              px={{ base: 6, sm: 8 }}
            >
              Verify OTP
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

export default UserVerifyOtp;
