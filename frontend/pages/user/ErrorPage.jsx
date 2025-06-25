import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const [params] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("Verifying payment status...");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const sourceId = params.get("source");

    if (!sourceId) {
      setMessage("Missing payment source ID.");
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceId }),
        });

        const data = await res.json();

        if (res.ok) {
          // Shouldn't reach here on /error route, but just in case
          toast({
            title: "Payment already confirmed.",
            status: "info",
            isClosable: true,
          });
          navigate("/success");
        } else {
          setMessage(data.error || "Payment failed. Order was cancelled.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setMessage("Something went wrong during verification.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [params, toast, navigate]);

  return (
    <Box maxW="lg" mx="auto" mt={12} textAlign="center" p={6}>
      <VStack spacing={4}>
        <Heading size="lg" color="red.500">
          Payment Error
        </Heading>

        {verifying ? (
          <>
            <Spinner size="lg" />
            <Text>{message}</Text>
          </>
        ) : (
          <>
            <Text>{message}</Text>
            <Button colorScheme="teal" mt={4} onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ErrorPage;
