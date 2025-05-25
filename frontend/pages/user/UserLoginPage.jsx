import { useState } from "react";
import UserLogin from "../../components/UserLogin";
import UserVerify from "../../components/UserVerify";
import { Container, Box, useColorModeValue } from "@chakra-ui/react";


const UserLoginPage = () => {
  const [email, setEmail] = useState("");

  return (
    <Container maxW={"container.sm"} p={12}>
        <Box
        w="full"
        maxW={{ base: "100%", md: "lg"}}
        bg={useColorModeValue("white", "gray.700")}
        p={{ base: 4, md: 6}}
        rounded={"lg"}
        shadow={"md"}
        mx="auto">

      {!email ? (
        <UserLogin onOtpRequested={setEmail} />
      ) : (
        <UserVerify email={email} />
      )}
        </Box>
    </Container>

  );
};

export default UserLoginPage;