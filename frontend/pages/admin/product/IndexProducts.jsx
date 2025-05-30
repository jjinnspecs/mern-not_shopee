import { Container, Text, VStack, Input, Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  TableContainer,
  Table,
  TableCaption,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tfoot,
    ButtonGroup,
    IconButton,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useColorModeValue,
    Heading,
    Flex,
    Select,
    Image

 } from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";

import { useCategoryStore } from "../../../src/store/category";

import { CgAdd } from "react-icons/cg";
import { FaEdit, FaTrash } from "react-icons/fa";

//products
import { useProductStore } from "../../../src/store/product";



const IndexProducts = () => {
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
    const Toast = useToast();
    const cancelRef = useRef();

    const { products, fetchProducts, createProduct, 
        updateProduct, deleteProduct } = useProductStore();
    const { fetchCategories, categories} = useCategoryStore();

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    })

    const [editProductId, setEditProductId] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    })

    //modal/alert dialog controls
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();
    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();

    const { isOpen: isAddOpen,
            onOpen: onAddOpen, 
            onClose: onAddClose 
        } = useDisclosure();
    
     //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    //handlers
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

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const priceNum = Number(updatedProduct.price);
    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.category || !updatedProduct.image) {
      Toast({
        title: "Error",
        description: "Please fill in all fields.",
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
    const { success, message } = await updateProduct(pid, { ...updatedProduct, price: priceNum });
    if (!success) {
      Toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      Toast({
        title: "Success",
        description: "Product updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onUpdateClose();
    }
  };

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (!success) {
      Toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      Toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onDeleteClose();
  };


  return (
    <Container maxW={"container.xl"} p={12}>
      <VStack spacing={8} align="stretch">
        <Heading as={"h1"} size={{ base:"lg", md: "xl"}} textAlign={"center"}
        mb={{ base: 2, md: 8 }}
          fontWeight="bold"
          color="teal.500"
          >Products
          </Heading>
      </VStack>
      <VStack spacing={8} align="start">

            <Button onClick={onAddOpen} colorScheme="teal" size={{ base: "md", md: "lg"}}>
                <CgAdd size={20} />
                <Text ml={2}>Add Product</Text>
            </Button>

            <Modal isOpen={isAddOpen} onClose={onAddClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Add New Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                        <Input
                  placeholder='Product Name'
                  name='name'
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  type='text'
                />
                <Input
                  placeholder='Product Price'
                  name='price'
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  type='number'
                />
                <Select
                  placeholder="Select Category"
                  name="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Input
                  placeholder='Product Image URL'
                  name='image'
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  type='text'
                />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleAddProduct}>
                            Save
                        </Button>
                        <Button variant='ghost' onClick={onAddClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
                </Modal>
      </VStack>
      <TableContainer marginTop={8}>
        <Table variant='simple'
                   bg={bgColor}
            textColor={textColor}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.map((product, idx) => {
              const category = categories.find(cat => cat._id === product.category);
              return (
                <Tr key={product._id}>
                  <Td>{(currentPage - 1) * itemsPerPage + idx + 1}</Td>
                  <Td>
                    <Image src={product.image} alt={product.name} boxSize="60px" objectFit="cover" />
                  </Td>
                  <Td>{product.name}</Td>
                  <Td>${product.price}</Td>
                  <Td>{category ? category.name : "Unknown"}</Td>
                  <Td>
                    <ButtonGroup spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        aria-label="Edit"
                        onClick={() => {
                          setEditProductId(product._id);
                          setUpdatedProduct(product);
                          onUpdateOpen();
                        }}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        aria-label="Delete"
                        onClick={() => {
                          setDeleteProductId(product._id);
                          onDeleteOpen();
                        }}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              );
            })}

            {/* Show message if no products */}
            {products.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign="center">No products found.</Td>
              </Tr>
            )}

            {/* Add empty rows if less than itemsPerPage */}
            {Array.from({ length: Math.max(0, itemsPerPage - paginatedProducts.length) }).map((_, i) => (
              <Tr key={`empty-${i}`}>
                <Td colSpan={6} height="93px" bg="transparent"></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* Pagination Controls */}
        <Text mt={4} textAlign="center" color="gray.600">
          Page {currentPage} of {totalPages}
        </Text>
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

        {/* Delete Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Product
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this product?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={() => handleDeleteProduct(deleteProductId)} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Update Modal */}
        <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder='Product Name'
                  name='name'
                  value={updatedProduct.name}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                  type='text'
                />
                <Input
                  placeholder='Product Price'
                  name='price'
                  value={updatedProduct.price}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                  type='number'
                />
                <Select
                  placeholder="Select Category"
                  name="category"
                  value={updatedProduct.category}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Input
                  placeholder='Product Image URL'
                  name='image'
                  value={updatedProduct.image}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
                  type='text'
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(editProductId, updatedProduct)}>Update</Button>
              <Button onClick={onUpdateClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
     </TableContainer>

      </Container>

  );
}
export default IndexProducts;
