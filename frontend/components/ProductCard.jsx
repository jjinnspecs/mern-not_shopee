import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
    Box,
    Image,
    Heading,
    Text,
    HStack,
    VStack,
    IconButton,
    useColorModeValue,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useProductStore } from '../src/store/product';
import { useState } from 'react';

const ProductCard = ({ product }) => {

    const { 
        isOpen: isDeleteOpen, 
        onOpen: onDeleteOpen, 
        onClose: onDeleteClose 
    } = useDisclosure();

    const { 
        isOpen: isUpdateOpen, 
        onOpen: onUpdateOpen, 
        onClose: onUpdateClose 
    } = useDisclosure();
    const [updatedProduct, setUpdatedProduct] = useState(product);

    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
    const Toast = useToast();
    const { deleteProduct, updateProduct } = useProductStore();


    const cancelRef = useRef();

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

    const handleUpdateProduct = async (pid, updatedProduct) => {
        const priceNum = Number(updatedProduct.price);
        if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.image) {
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

    return (
        <Box
            shadow='lg'
            rounded='lg'
            overflow='hidden'
            transition='all 0.3s'
            _hover={{ shadow: 'xl', transform: 'scale(1.02)' }}
            bg={bgColor}
            textColor={textColor}
        >
            <Image
                src={product.image}
                alt={product.name}
                h={48}
                w='full'
                objectFit='cover'
            />
            <Box p={4}>
                <Heading fontSize='xl' fontWeight='bold'>
                    {product.name}
                </Heading>

                <Text fontSize='lg' color='gray.500'>
                    $ {product.price}
                </Text>

                <HStack spacing={2}>
                    <IconButton icon={<EditIcon />} 
                    onClick={onUpdateOpen}
                    colorScheme='blue' />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme='red'
                        onClick={onDeleteOpen}
                    />
                </HStack>
            </Box>

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
                            <Button colorScheme='red' onClick={() => handleDeleteProduct(product._id)} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

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
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}>
                            </Input>
                            <Input
                                placeholder='Product Price'
                                name='price'
                                value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                            ></Input>
                            <Input
                                placeholder='Product Image'
                                name='image'
                                value={updatedProduct.image}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value})}
                            ></Input>
                        </VStack>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>Update</Button>
                        <Button onClick={onUpdateClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ProductCard;
