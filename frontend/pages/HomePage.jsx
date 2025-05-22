import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useProductStore } from "../src/store/product";
import ProductCard from "../components/ProductCard";


const HomePage = () => {
  const {fetchProducts, products} = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // console.log("Products:", products);

  return (
    <Container maxW={"container.xl"} p={12}>
      <VStack spacing={8} align="stretch">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          color="teal.500"
          >Current Products
          </Text>

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

            {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
              key={product._id}
              product={product}
              />
            ))
          ) : (
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
            )}
                    </SimpleGrid>
      </VStack>
      </Container>

  );
}
export default HomePage;