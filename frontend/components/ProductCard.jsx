import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
    Box,
    Image,
    Heading,
    Text,
    useColorModeValue,
    useToast,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useBreakpointValue,
    UnorderedList,
    ListItem,
    Stack
} from '@chakra-ui/react';
import { useRef, useEffect, useState } from 'react';
import { useProductStore } from '../src/store/product';
import { useCategoryStore } from '../src/store/category';
import { useCartStore } from '../src/store/cart';
import { useAuthStore } from '../src/store/auth';

import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {

    const { 
        isOpen: isViewOpen, 
        onOpen: onViewOpen, 
        onClose: onViewClose 
    } = useDisclosure();

    const textColor = useColorModeValue('gray.700', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
    const toast = useToast();

    const { categories, fetchCategories } = useCategoryStore();
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    const category = categories.find((category) => category._id === product.category);
    const categoryName = category ? category.name : 'Unknown Category';


    const { addToCart } = useCartStore();
    const { user, token } = useAuthStore();

    const handleAddToCart = async () => {
        if (!token || !user?.email) {
            toast({
                title: "Login required",
                description: "Please log in to add items to your cart.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

    const res = await addToCart({ userId: user._id, productId: product._id, quantity: 1 });
    toast({
        title: res.success ? "Added to cart" : "Error",
        description: res.message ? "Product added to cart successfully." : res.message,
        status: res.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
    });
};

const cartButtonLabel = useBreakpointValue({ base: "Add", sm: "Add", md:"Add", lg: "Add to Cart" });


    return (
        <Box
            bg={bgColor}
            textColor={textColor}
            overflow="hidden"
            shadow="md"
            borderRadius="md"
            transition="all 0.2s"
            _hover={{ shadow: "xl", transform: "scale(1.02)" }}
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="space-between"
        >
            <Box position="relative" paddingTop="75%"> {/* 4:3 aspect ratio */}
                <Image
                src={product.image}
                alt={product.name}
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                objectFit="cover"
                />
            </Box>

            <Box p={{ base: 4, md: 6 }}>
               <Heading
                fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
                noOfLines={2}
                >
                    {product.name}
                </Heading>

                <Text fontWeight="bold" color="teal.600" fontSize="lg">
                       ₱{" "}
                        {Number(product.price)
                            .toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Text>

                <Text fontSize='sm' color='gray.500' mb={4}>
                    Category: {categoryName}
                </Text>

                 <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    spacing={3}
                    justify="stretch"
                    align="stretch"
                    >

                    <Button
                        variant="outline"
                        colorScheme="gray"
                        onClick={onViewOpen}
                        size="sm"
                        w="full"
                    >
                        Details
                    </Button>

                    <Button
                        leftIcon={<FaShoppingCart />}
                        colorScheme="orange"
                        onClick={handleAddToCart}
                        size="sm"
                        w="full"
                    >
                        {cartButtonLabel}
                    </Button>
                </Stack>
            </Box>

                    {/* View Details Modal */}
                    <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg" isCentered>
                      <ModalOverlay />
                      <ModalContent borderRadius="lg">
                        <ModalHeader 
                        textAlign="center"
                          color="teal.200"
                        >
                            {product.name}
                        </ModalHeader>
                        <ModalCloseButton />
                       <ModalBody>
                            {product.details ? (
                            <UnorderedList spacing={2}>
                                {product.details.split('\n').map((line, idx) => (
                                <ListItem key={idx}>
                                    <Text fontSize="sm">{line.replace(/^•\s*/, '')}</Text>
                                </ListItem>
                                ))}
                            </UnorderedList>
                            ) : (
                            <Text>No details available.</Text>
                            )}
                        </ModalBody>
                          </ModalContent>
                          </Modal>
        </Box>
    );
};

export default ProductCard;
