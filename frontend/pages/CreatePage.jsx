import { Container, Heading, Box, Input, Button, VStack, useToast, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../src/store/product.js";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

const toast = useToast();

  const {createProduct} = useProductStore();

  const handleAddProduct = async() => {
    const { success, message } = await createProduct(newProduct);
    if(!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewProduct({
        name: "",
        price: "",
        image: "",
      });
    }

  }

  return (<Container maxW={"container.sm"}>
    <VStack spacing={8}>

      <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
        Add new product
      </Heading>
      <Box
        w={"xl"}
        bg={useColorModeValue("white", "gray.700")}
        p={6}
        rounded={"lg"}
        shadow={"md"}
      >
      <VStack spacing={6}>
        <Input
          mb={2}
          placeholder="Product Name"
          name='name'
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        <Input
          mb={2}
          placeholder="Product Price"
          name='price'
          type='number'
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
        <Input
          mb={4}
          placeholder="Product Image URL"
          name='image'
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />

          <Button
            bg="teal.200"
            color="black"
            width={"full"}
            onClick={handleAddProduct}
          > Add Product
            </Button>
      </VStack>
      </Box>
    </VStack>

  </Container>);
}
export default CreatePage;