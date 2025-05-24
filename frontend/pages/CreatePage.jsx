import { Container, Heading, Box, Input, Button, VStack, useToast, useColorModeValue, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useProductStore } from "../src/store/product.js";
import { useCategoryStore } from "../src/store/category.js";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

const toast = useToast();

  const {createProduct} = useProductStore();

  const handleAddProduct = async() => {
    if(!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
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
        category: "",
        image: "",
      });
    }

  }

  const { fetchCategories, categories } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
          > Add Product
            </Button>
      </VStack>
      </Box>
    </VStack>

  </Container>);
}
export default CreatePage;