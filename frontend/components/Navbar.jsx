import React, { use } from "react";
import { Container, Button, Flex, HStack, Text, useColorMode, } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CgAdd } from "react-icons/cg";
import { LuMoon, LuSun } from 'react-icons/lu';

const Navbar = () => {
    const { colorMode, toggleColorMode,} = useColorMode();
  return (
    <Container maxW="container.xl" px={4}>

      {/* <nav>
        <div><a href="/">Home</a></div>
        <a href="/create">Create</a>
      </nav> */}
      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Text
          fontSize={{ base: 'xl', md: '3xl' }}
          fontStyle={'italic'}
          color="orange.500"
          fontWeight={'bold'}
          textAlign={{ base: 'center', md: 'left' }}
          textTransform="uppercase"
        >
          <Link to={"/"}>Not Shopee</Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
            <Link to={"/create"}>
            <Button>
                <CgAdd size={20} />
                <Text ml={2}>Create</Text>
            </Button>
            </Link>
            <Button onClick={toggleColorMode}>
           {colorMode === 'dark' ? <LuMoon /> : <LuSun />}
            </Button>
        </HStack>
      </Flex>
    </Container>
  );
};
export default Navbar;