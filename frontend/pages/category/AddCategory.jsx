import { Container, Text, VStack } from "@chakra-ui/react";


const AddCategory = () => {
  return (
 <Container maxW={"container.xl"} p={12}>
      <VStack spacing={8} align="stretch">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          color="teal.500"
          >Add Category
          </Text>
      </VStack>
      <VStack spacing={8} align="stretch">
      </VStack>
      </Container>
  );
}
export default AddCategory;