import React from "react";
import { Container, Button, Flex, HStack, Text, useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
 } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { CgAdd } from "react-icons/cg";
import { LuMoon, LuSun } from 'react-icons/lu';
import { FaShoppingCart, FaShoppingBag  } from "react-icons/fa";

import { useAuthStore } from "../src/store/auth.js";

const Navbar = () => {
    const logout = useAuthStore((state) => state.logout);
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    const { colorMode, toggleColorMode,} = useColorMode();
  return (
    <Container maxW="container.xl" px={4}>

      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexDirection={{ base: 'column', md: 'row' }}
        py={{ base: 2, md: 0 }}
        gap={{ base: 2, md: 0 }}
      >
      <Flex alignItems="center" gap={4} w="full" justify={{ base: "center", md: "flex-start"}}>
        <Menu isLazy>
          <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<HamburgerIcon />}
          variant='outline'
          />
          <MenuList>
               <Link to={"/admin/products"}>
            <MenuItem>
              <Text fontSize="lg">Products Management</Text>
            </MenuItem>
            </Link>
            <Link to={"/admin/category"}>
            <MenuItem>
              <Text fontSize="lg">Categories Management</Text>
            </MenuItem>
            </Link>
            <Link to={"/admin/orders"}>
            <MenuItem>
              <Text fontSize="lg">Orders Management</Text>
            </MenuItem>
            </Link>
          </MenuList>
        </Menu>

        <Text
          fontSize={{ base: 'xl', md: '3xl' }}
          fontStyle={'italic'}
          color="orange.500"
          fontWeight={'bold'}
          textAlign={{ base: 'center', md: 'left' }}
          textTransform="uppercase"
          mx={{ base: "auto", md: 0 }}
        >
          <Link to={"/"}>Not Shopee</Link>
        </Text>
        </Flex>

        <HStack spacing={2} alignItems={"center"} justifyContent={"center"} mt={{ base: 2, md: 0}}>                                                   
            {/* <Link to={"/admin/create"}>
            <Button size={{ base: "sm", md: "md"}}>
                <CgAdd size={20} />
                <Text ml={2} display={{ base: "none", sm: "inline"}}>Add Product</Text>
            </Button>
            </Link> */}

              <Link to="/cart">
              <Button size={{ base: "sm", md: "md"}} colorScheme="orange">
                <FaShoppingCart />
              </Button>
            </Link>

             <Link to="/orders">
              <Button size={{ base: "sm", md: "md"}} colorScheme="teal">
                <FaShoppingBag />
              </Button>
            </Link>

            <Button onClick={toggleColorMode} size={{ base: "sm", md: "md"}}>
           {colorMode === 'dark' ? <LuMoon /> : <LuSun />}
            </Button>
        {token ? (
          <>
          {user?.email && (
            <Text color="teal.500" fontWeight="bold" fontSize="md" px={2}>
              {user.email}
            </Text>
          )}
            <Button onClick={logout} size={{ base: "sm", md: "md"}} colorScheme="red">
              <Text display={{ base: "none", sm: "inline"}}>Logout</Text>
            </Button>
            </>
        ) : (
          <Link to="/user/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        )}
        </HStack>
      </Flex>

    </Container>
    
  );
};
export default Navbar;