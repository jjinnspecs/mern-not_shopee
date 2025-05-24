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

const Navbar = () => {
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
            <Link to={"/category"}>
            <MenuItem>
              <Text fontSize="lg">Category</Text>
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
            <Link to={"/create"}>
            <Button size={{ base: "sm", md: "md"}}>
                <CgAdd size={20} />
                <Text ml={2} display={{ base: "none", sm: "inline"}}>Add Product</Text>
            </Button>
            </Link>
            <Button onClick={toggleColorMode} size={{ base: "sm", md: "md"}}>
           {colorMode === 'dark' ? <LuMoon /> : <LuSun />}
            </Button>
            
        </HStack>
      </Flex>

    </Container>
    
  );
};
export default Navbar;