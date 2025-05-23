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

 } from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";

import { useCategoryStore } from "../../src/store/category";

import { CgAdd } from "react-icons/cg";
import { FaEdit, FaTrash } from "react-icons/fa";



const IndexCategory = () => {
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');

    const [newCategory, setNewCategory] = React.useState({
        name: "",
    });
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [updatedCategory, setUpdatedCategory] = useState({ name: "" });

    const [deleteCategoryId, setDeleteCategoryId] = React.useState(null);

    const toast = useToast();
    const cancelRef = useRef();

    const { fetchCategories, createCategory, updateCategory, deleteCategory, categories} = useCategoryStore();

    const handleAddCategory = async() => {
        const { success, message } = await createCategory(newCategory);
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
            setNewCategory({
                name: "",
            });
        }}

        const handleDeleteCategory = async (cid) => {
            const { success, message } = await deleteCategory(cid);
            if (!success) {
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
            }
            onDeleteClose();
        };
        const handleUpdateCategory = async (cid, updatedCategory) => {
            const { success, message } = await updateCategory(cid, updatedCategory);
            if (!success) {
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
            }
            onUpdateClose();
        };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);


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

  return (
    <Container maxW={"container.xl"} p={12}>
      <VStack spacing={8} align="stretch">
        <Heading as={"h1"} size={{ base:"lg", md: "xl"}} textAlign={"center"}
        mb={{ base: 2, md: 8 }}
          fontWeight="bold"
          color="teal.500"
          >Product Categories
          </Heading>
      </VStack>
      <VStack spacing={8} align="start">

            <Button onClick={onAddOpen} colorScheme="teal" size="lg">
                <CgAdd size={20} />
                <Text ml={2}>Add Category</Text>
            </Button>

            <Modal isOpen={isAddOpen} onClose={onAddClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder='Category Name'
                                name='name'
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                type='text'
                            />

                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleAddCategory}>
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
          {/* <TableCaption>Product Categories</TableCaption> */}
          <Thead>
            <Tr>
              <Th w={4}>#</Th>
              <Th>Category Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((category, idx) => (
                <Tr key={category._id}>
                    <Td>{idx + 1}</Td>
                    <Td>{category.name}</Td>
                    <Td>
                        <ButtonGroup spacing={2}>
                            <IconButton
                                icon={<FaEdit />}
                                colorScheme="blue"
                                aria-label="Edit"
                                onClick={() => {
                                    setEditCategoryId(category._id);
                                    setUpdatedCategory({ name: category.name });
                                    onUpdateOpen();
                                }}
                            />
                            <IconButton
                                icon={<FaTrash />}
                                colorScheme="red"
                                aria-label="Delete"
                                onClick={() => {
                                    setDeleteCategoryId(category._id);
                                    onDeleteOpen();
                                }}
                            />
                        </ButtonGroup>
                    </Td>
                </Tr>
            ))}
          </Tbody>
        </Table>
                    <AlertDialog
                        isOpen={isDeleteOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onDeleteClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Delete Category
                                </AlertDialogHeader>
        
                                <AlertDialogBody>
                                    Are you sure you want to delete this category?
                                </AlertDialogBody>
        
                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onDeleteClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme='red' onClick={() => handleDeleteCategory(deleteCategoryId)} ml={3}>
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
        
                    <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Update Category</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack spacing={4}>
                                    <Input
                                        placeholder='Category Name'
                                        name='name'
                                        value={updatedCategory.name}
                                        onChange={(e) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}>
                                    </Input>
                                </VStack>
                                
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={() => handleUpdateCategory(editCategoryId, updatedCategory)}>Update</Button>
                                <Button onClick={onUpdateClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
     </TableContainer>

      </Container>

  );
}
export default IndexCategory;
