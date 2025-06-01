import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/store/auth";
import {
  Container,
  Heading,
  Box,
  Input,
  Button,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin, token, user } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please enter both username and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdmin(username, password);
      if (!res.success) {
        toast({
          title: "Login Failed",
          description: res.message || "Invalid credentials.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Successful",
          description: `Welcome, ${res.user?.name || "Admin"}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setUsername("");
        setPassword("");

        setTimeout(() => {
          navigate("/admin");
        }, 2000);

      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const isAdminLoggedIn = token && user?.role === "admin";

  return (
    <Container maxW="container.sm" p={12}>
      <VStack spacing={8} align="stretch">
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          textAlign="center"
          color="blue.500"
        >
          {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
        </Heading>

        <Box
          bg={cardBgColor}
          p={8}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="lg"
        >
          {isAdminLoggedIn ? (
            <VStack spacing={4}>
              <Text textAlign="center" color="gray.600">
                Welcome, {user.name || user.username}!
              </Text>
              <Text fontSize="sm" color="gray.500">
                You are logged in as an administrator.
              </Text>
            </VStack>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      size="lg"
                      isDisabled={isLoading}
                      focusBorderColor="blue.400"
                      autoComplete="username"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isDisabled={isLoading}
                        focusBorderColor="blue.400"
                        autoComplete="current-password"
                      />
                      {/* <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={togglePasswordVisibility}
                          variant="ghost"
                          size="sm"
                          isDisabled={isLoading}
                        />
                      </InputRightElement> */}
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="100%"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign In as Admin
                  </Button>
                </VStack>
              </form>

              <Divider my={6} />

              <Text fontSize="sm" textAlign="center" color="gray.500">
                Authorized personnel only. All login attempts are monitored.
              </Text>
            </>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default AdminLogin;
