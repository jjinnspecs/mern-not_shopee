import { 
  Container, 
  SimpleGrid, 
  Text, 
  VStack, 
  HStack, 
  Flex, 
  Input, 
  Select, 
  Button, 
  Heading,
  InputGroup,
  InputRightElement,
  Skeleton,
  SkeletonText,
  Spinner
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useProductStore } from "../src/store/product";
import { useCategoryStore } from "../src/store/category";
import ProductCard from "../components/ProductCard";


const HomePage = () => {
  
  const { fetchProducts, products, loading } = useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const topRef = useRef(null); // for scrolling to top

  // fetch products and categories on initial render
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // local input states
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategoryInput, setSelectedCategoryInput] = useState("");

  // actual applied filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory 
      ? product.category === selectedCategory 
      : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort products by newest first
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // go back to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // apply filters when it is called
  const handleApplyFilters = () => {
    setSearch(searchInput);
    setSelectedCategory(selectedCategoryInput);
  }

  // reset all filters and inputs
  const handleClearSearch = () => {
    setSearchInput("");
    setSelectedCategoryInput("");
    setSearch("");
    setSelectedCategory("");
  };

  // handle page change and scroll to top
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    // use setTimeout to ensure the scroll happens after state update and re-render
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 10);
  }, []);

    if (loading) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Text>Loading products]...</Text>
                </VStack>
            </Container>
        );
    }

  return (
    <Container maxW="container.xl" p={{ base: 4, md: 12 }} id="top">
      <VStack spacing={6} align="stretch" ref={topRef}>
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          textAlign="center"
          color="teal.500"
        >
          Current Products
        </Heading>

        <Flex
          direction={{ base: "column", sm: "row" }}
          align={{ base: "stretch", sm: "center" }}
          gap={{ base: 3, sm: 4 }}
          mb={4}
          wrap="wrap"
        >

          <Flex flex="2" minW="200px">
            <InputGroup>
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                borderColor="teal.500"
              />
              <InputRightElement width="4rem">
                {searchInput ? (
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleClearSearch}
                    variant="ghost"
                  >
                    Clear
                  </Button>
                ) : (
                  <SearchIcon color="gray.500" />
                )}
              </InputRightElement>
            </InputGroup>
          </Flex>


          <Select
            placeholder="All Categories"
            value={selectedCategoryInput}
            onChange={(e) => setSelectedCategoryInput(e.target.value)}
            borderColor="teal.500"
            flex="1"
            minW="100px"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>


          <Button
            onClick={handleApplyFilters}
            colorScheme="teal"
            flexShrink={0}
            minW="140px"
          >
            Search
          </Button>
        </Flex>

        <SimpleGrid
          columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
          spacing={6}
          w="full"
        >
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <Flex
              w="full"
              align="center"
              justify="center"
              gridColumn="1 / -1"
            >
              <Text fontSize="lg" textAlign="center" color="gray.600">
                No products found.
              </Text>
            </Flex>
          )}
        </SimpleGrid>

        {/* pagination */}
        {totalPages > 0 && (
          <VStack spacing={2} mt={6}>
            <Text textAlign="center" color="gray.600">
              Page {currentPage} of {totalPages}
            </Text>
            <HStack spacing={2} wrap="wrap" justify="center">
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
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
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
              >
                Next
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
