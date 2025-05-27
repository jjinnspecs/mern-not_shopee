import { useState } from "react";
import { useAuthStore } from "../src/store/auth";
import { Container, Heading, 
Box, 
Input, 
Button, 
VStack, 
useToast,
HStack,
Text,
useColorModeValue,
} from "@chakra-ui/react";

const UserRequestOtp = ({ onOtpRequested }) => {
  const requestUserOtp = useAuthStore((state) => state.requestUserOtp);
  const verifyUserOtp = useAuthStore((state) => state.verifyUserOtp);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);

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
        title: "OTP sent! Please check your email.",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true
      });
      onOtpRequested(email);
    }
  };

  return (
    <Container maxW={"container.sm"}>
    <VStack spacing={8} align="stretch">
              <Heading as={"h1"} size={{ base:"lg", md: "xl"}} textAlign={"center"}
        mb={{ base: 2, md: 8 }}
        color="teal.500">
        User Login
      </Heading>
    <VStack spacing={6}>
            <form onSubmit={handleRequest} style={{ width:"100%"}}>
        <HStack>
       <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        size={"md"}
        required
      />
        <Button
            type="submit"
            bg="teal.200"
            size={{ base: "md", md: "md"}}
            color="black"
        >
            <Text p={4}>Request OTP</Text>
        </Button>
        </HStack>
                </form>
        <VStack>
            {message}
        </VStack>

    </VStack>
    </VStack>
    </Container>

  );
};

export default UserRequestOtp;