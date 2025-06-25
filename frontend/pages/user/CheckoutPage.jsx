import React, { useState, useEffect } from "react";
import {
    Box, Button, 
    Checkbox, FormControl,
    FormLabel, Input,
    HStack,
    VStack, Heading,
    Select, useToast,
    Text
} from "@chakra-ui/react";
import { useAuthStore } from "../../src/store/auth";
import { useCartStore } from "../../src/store/cart";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const { user } = useAuthStore();
    const { cart, fetchCart } = useCartStore();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: user?.email || "",
        customerName: "",
        phone: "",
        deliveryAddress: "",
        billingAddress: "",
        sameAsDelivery: true,
        paymentMethod: "cod",
    });
    const [loading, setLoading] = useState(false);
    const Toast = useToast();
    const navigate = useNavigate();

    //autofill cart and email
    useEffect(() => {
        if (user?._id) fetchCart(user._id);
        if (user?.email) setForm(f => ({ ...f, email: user.email }));
    }, [user]);

    //handle input changes
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "sameAsDelivery" && checked ? { billingAddress: "" } : {})
        }));
    };

    //step 1. validate customer info
    const handleNext = () => {
        if (
            !form.email ||
            !form.customerName ||
            !form.phone ||
            !form.deliveryAddress ||
            (!form.sameAsDelivery && !form.billingAddress)
        ) {
            Toast({ title: "Please complete all required fields.", status: "warning" });
            return;
        }
        setStep(2);
    };

    //step 2. submit payment
    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/checkout/paymongo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id,
                    customerName: form.customerName,
                    phone: form.phone,
                    deliveryAddress: form.deliveryAddress,
                    billingAddress: form.sameAsDelivery ? form.deliveryAddress : form.billingAddress,
                    paymentMethod: form.paymentMethod
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.cod) {
                Toast({ title: "Order placed with Cash on Delivery.", status: "success" });
                    navigate("/");
                } else {
                    Toast({ title: data.error || "Checkout failed", status: "error" });
                }
            } catch (error) {
                Toast({ title: "Checkout error", status: "error" });
                navigate("/error");
            }
            setLoading(false);
        };

        return (
            <Box maxW="md" mx="auto" mt={8} p={6} borderRadius="lg">
                 <Heading as="h1" size={{ base: "lg", md: "xl" }} 
                    textAlign="center" mb={{ base: 2, md: 8 }}
                    color="teal.500"
                >
                Checkout
                </Heading>
                {step === 1 && (
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input name="email"
                            value={form.email}
                            onChange={handleChange} 
                           />
                        </FormControl>
                          <FormControl isRequired>
                            <FormLabel>Customer Name</FormLabel>
                            <Input name="customerName" 
                            value={form.customerName}
                            onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Phone Number</FormLabel>
                            <Input name="phone" 
                            value={form.phone}
                            onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Delivery Address</FormLabel>
                            <Input name="deliveryAddress"
                            value={form.deliveryAddress}
                            onChange={handleChange}
                            />
                        </FormControl>
                        <Checkbox
                            name="sameAsDelivery"
                            isChecked={form.sameAsDelivery}
                            onChange={handleChange}
                        >
                            Billing address is the same as delivery address
                        </Checkbox>
                        {!form.sameAsDelivery && (
                            <FormControl isRequired>
                                <FormLabel>Billing Address</FormLabel>
                                <Input name="billingAddress"
                                value={form.billingAddress}
                                onChange={handleChange}
                                />
                            </FormControl>
                        )}
                        <Button
                        colorScheme="teal"
                        onClick={handleNext}
                        >
                        Next
                        </Button>
                    </VStack>
                )}
                {step === 2 && (
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Payment Method</FormLabel>
                            <Select name="paymentMethod"
                             value={form.paymentMethod}
                             onChange={handleChange}
                             >
                                {/* <option value="gcash">GCash</option> */}
                                <option value="grab_pay">GrabPay</option>
                                <option value="cod">Cash on Delivery</option>
                            </Select>
                        </FormControl>
                        <Button colorScheme="orange"
                        onClick={handleCheckout}
                        isLoading={loading}
                        >
                            Place Order
                        </Button>
                        <Button variant="ghost"
                        onClick={() => setStep(1)}>
                            Back
                        </Button>
                    </VStack>
                )}
                <Box mt={6} borderTop="1px solid" borderColor="gray.200" pt={4}>
  <Heading size="sm" mb={3} color="gray.600" textAlign="left">
    Cart Summary
  </Heading>

  <VStack align="stretch" spacing={3}>
    {cart?.items?.map(item => {
      const subtotal = item.product.price * item.quantity;
      return (
        <Box key={item.product._id}>
          <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
            {item.product.name}
          </Text>
          <HStack justify="space-between" fontSize="sm" color="gray.600">
            <Text>{item.quantity} × ₱{item.product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Text>
            <Text fontWeight="semibold">
              ₱{subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </HStack>
        </Box>
      );
    })}
  </VStack>

  <Box mt={4} pt={2} borderTop="1px dashed" borderColor="gray.300">
    <HStack justify="space-between">
      <Text fontWeight="bold" fontSize="md">Total</Text>
      <Text fontWeight="bold" fontSize="md" color="teal.600">
        ₱{cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
          .toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </Text>
    </HStack>
  </Box>
                </Box>

            </Box>
        );
};

export default CheckoutPage;