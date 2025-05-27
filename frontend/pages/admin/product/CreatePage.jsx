import { Container, Heading, Box, Input, Button, VStack, useToast, useColorModeValue, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useProductStore } from "../../../src/store/product.js";
import { useCategoryStore } from "../../../src/store/category.js";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

const Toast = useToast();

  const {createProduct} = useProductStore();

  const handleAddProduct = async() => {
    const priceNum = Number(newProduct.price);

    if(!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
      Toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
      if (isNaN(priceNum) || priceNum <= 0) {
            Toast({
                title: "Error",
                description: "Price must be a number greater than 0.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

    const { success, message } = await createProduct(newProduct);
    if(!success) {
      Toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    else {
      Toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewProduct({
        name: "",
        price: "",
        category: "",
        image: "",
      });
    }

  }

  const { fetchCategories, categories } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
  <Container maxW={"container.sm"} p={12}>
    <VStack spacing={8} align="stretch">

      <Heading as={"h1"} size={{ base:"lg", md: "xl"}} textAlign={"center"}
        mb={{ base: 2, md: 8 }}
        color="teal.500"
        >
        Add new product
      </Heading>
      <Box
        w="full"
        maxW={{ base: "100%", md: "lg" }}
        bg={useColorModeValue("white", "gray.700")}
        p={{ base: 4, md: 6 }}
        rounded={"lg"}
        shadow={"md"}
        mx="auto"
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

        <Select
          mb={2}
          placeholder="Select Category"
          name="category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
            
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
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
            size={{ base: "md", md: "lg" }}
          > Add Product
            </Button>
      </VStack>
      </Box>
    </VStack>

  </Container>);
}
export default CreatePage;