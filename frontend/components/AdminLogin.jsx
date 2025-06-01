import { useState, useEffect } from "react";
import { useAuthStore } from "../src/store/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  Input,
  Button,
  VStack,
  useToast,
  HStack,
  Text
} from "@chakra-ui/react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin, token, user } = useAuthStore();
  // ... other state

  // Check if already logged in
  useEffect(() => {
    const currentToken = token || localStorage.getItem('token');
    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    
    if (currentToken && currentUser?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [token, user, navigate]);

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
      console.log('Login response:', res); // Debug log
      
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
          description: `Welcome, ${res.user?.username || "Admin"}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setUsername("");
        setPassword("");

        // Navigate immediately after successful login
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
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

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8} align="stretch">
        <Heading 
          as={"h1"} 
          size={{ base:"lg", md: "xl"}} 
          textAlign={"center"}
          mb={{ base: 2, md: 8 }}
          p={16}
          color="teal.500"
        >
          Admin Login
        </Heading>
        <VStack spacing={6}>
          <form onSubmit={handleLogin} style={{ width:"100%"}}>
            <VStack spacing={4}>
              <Input
                name="username"
                type="text"
                placeholder="Enter Username"
                value={form.username}
                onChange={handleChange}
                size={"md"}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                size={"md"}
                required
              />
              <Button
                type="submit"
                bg="teal.200"
                size={{ base: "md", md: "md"}}
                color="black"
                width="100%"
              >
                <Text p={4}>Login</Text>
              </Button>
            </VStack>
          </form>
          <VStack>
            {message}
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default AdminLogin;
