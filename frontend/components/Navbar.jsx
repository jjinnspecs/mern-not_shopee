import React from "react";
import { 
  Container,
  Button, 
  Flex, 
  HStack, 
  Text, 
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  VStack,
  Show,
  Hide,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
 } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { LuMoon, LuSun } from 'react-icons/lu';
import { FaShoppingCart, FaShoppingBag  } from "react-icons/fa";

import { useAuthStore } from "../src/store/auth.js";

const Navbar = () => {
    const logout = useAuthStore((state) => state.logout);
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const { colorMode, toggleColorMode,} = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    const handleLogout = () => {
        logout();
        onClose();
    }

  return (

    <Box bg={colorMode === "light" ? "gray.50" : "gray.800"} px={4} py={2} boxShadow="md">
    <Container maxW="container.xl" px={4}>

      <Flex
        h={16}
        align="center"
        justifyContent="space-between"
        direction={{ base: 'column', md: 'row' }}
      >

        {/* branding & hamburger menu */}
      <Flex align="center" justify="space-between" w="full">
        <Text
          fontSize={{ base: 'xl', md: '2xl' }}
          fontStyle="italic"
          color="orange.500"
          fontWeight="bold"
          textTransform="uppercase"
        >
          <Link to={"/"}>Not Shopee</Link>
        </Text>
        {/* mobile menu */}

        <Show below="md">
          <Menu>
            <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
            aria-label="Menu"
            />
            <MenuList>
              <MenuItem variant="outline">{user?.email}</MenuItem>
              <MenuItem as={Link} to="/cart">
              Cart
              </MenuItem>
              <MenuItem as={Link} to="/orders">
              Orders
              </MenuItem>
       {token ? (
                    <>
                      <MenuItem onClick={onOpen} color="red.500">
                        Logout
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem as={Link} to="/user/login">
                      Login
                    </MenuItem>
                  )}

                  <MenuItem onClick={toggleColorMode}>
                    {colorMode === "dark" ? "Dark Mode" : "Light Mode"}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Show>
          </Flex>

          {/* desktop nav actions */}
      <Hide below="md">
        <HStack spacing={4} mt={{ base: 4, md: 0}}>

          {user?.email && (
            <Text color="teal.500" fontWeight="bold">
              {user.email}
            </Text>
          )}
              <Link to="/cart">
              <Button size="md" colorScheme="orange">
                <FaShoppingCart />
              </Button>
            </Link>

             <Link to="/orders">
              <Button size="md" colorScheme="teal">
                <FaShoppingBag />
              </Button>
            </Link>

            <Button onClick={toggleColorMode} size="md">
           {colorMode === 'dark' ? <LuMoon /> : <LuSun />}
            </Button>
        {token ? (
          <>
            <Button onClick={onOpen} size="md" colorScheme="red">
              Logout
            </Button>
            </>
        ) : (
          <Link to="/user/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        )}
        </HStack>
      </Hide>
      </Flex>

    </Container>

     {/* logout confirmation dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to logout?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
  </Box>
    
  );
};
export default Navbar;