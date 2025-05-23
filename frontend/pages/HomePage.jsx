import { Container, SimpleGrid, Text, VStack, HStack, Flex, Input, Select, Button, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProductStore } from "../src/store/product";
import ProductCard from "../components/ProductCard";
import { useCategoryStore } from "../src/store/category";


const HomePage = () => {
  const {fetchProducts, products} = useProductStore();
  const {fetchCategories, categories} = useCategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);
  // console.log("Products:", products);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //reset pagination when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  return (
    <Container maxW={"container.xl"} p={12}>
      <VStack spacing={8} align="stretch">
        <Heading as={"h1"} size={{ base:"lg", md: "xl"}}
          fontWeight="bold"
          textAlign="center"
          color="teal.500"
          mb={{ base: 2, md: 8 }}
          >Current Products
          </Heading>

        {/* <HStack spacing={2} mb={4} gap={2} justifyContent="center">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="200px"
            mx="auto"
            borderColor="teal.500"
          />
          <Select
            placeholder="All"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW="200px"
            mx="auto"
            borderColor="teal.500"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                {category.name}
                </option>
              ))}
          </Select>
        </HStack> */}
         <Flex alignItems="center" gap={4} mb={4} justifyContent="center">
                 <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="400px"
            borderColor="teal.500"
            flex="1"
          />
          <Select
            placeholder="All"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW="150px"
            borderColor="teal.500"
            flex="1"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                {category.name}
                </option>
              ))}
          </Select>
                </Flex>
          <SimpleGrid
            columns={{ 
              base: 1,
              sm: 2,
              md: 3,
              lg: 4,
            }}
            spacing={10}
            w={"full"}
          >

            {/* {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
              key={product._id}
              product={product}
              />
            )) */}
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product}/>
              ))
          ) : (
          
          <Flex
            w="full"
            h="200px"
            align="center"
            justify="center"
            gridColumn="1 / -1"
          >
          <Text fontSize="xl" 
          textAlign="center"
          color="gray.600"
          > No products found.{" "}
          <Link to={"/create"}>
            <Text as="span" 
            color="blue.500"
            fontWeight="bold" 
            _hover={{textDecoration:"underline"}}>
              Create a product
            </Text>
          </Link>
          </Text>
          </Flex>
            )}
                    </SimpleGrid>
            <Flex justify="center" mt={6} gap={2}>
              <Button
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
                >
                  Prev
              </Button>
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  size="sm"
                  variant={currentPage === index + 1 ? "solid" : "outline"}
                  colorScheme="teal"
                  onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </Button>
              ))}
              <Button
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                isDisabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>

            </Flex>
      </VStack>
      </Container>

  );
}
export default HomePage;