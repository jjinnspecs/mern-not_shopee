import { useState } from "react";
import { useAuthStore } from "../src/store/auth";
import { useNavigate } from "react-router-dom";
import {Container,
  Heading,
  Input,
  Button,
  VStack,
  useToast,
  HStack,
  Text
} from "@chakra-ui/react";

const UserVerifyOtp = ({ email }) => {
  const verifyUserOtp = useAuthStore((state) => state.verifyUserOtp);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const Toast = useToast();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const data = await verifyUserOtp(email, otp)
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
   <Container maxW={"container.sm"}>
    <VStack spacing={8} align="stretch">
              <Heading as={"h1"} size={{ base:"lg", md: "xl"}} textAlign={"center"}
        mb={{ base: 2, md: 8 }}>
        User Login
      </Heading>
    <VStack spacing={6}>
            <form onSubmit={handleVerify} style={{ width:"100%"}}>
        <HStack>
       <Input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        size={"lg"}
        required
      />
        <Button
            type="submit"
            bg="teal.200"
            size={{ base: "md", md: "lg"}}
            color="black"
        >
            <Text p={4}>Verify OTP</Text>
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

export default UserVerifyOtp;