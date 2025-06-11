import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  IconButton,
  HStack,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      borderTop="1px solid"
      borderColor={borderColor}
      py={6}
      mt={10}
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Container maxW="container.lg">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} justify="space-between" align="center">
          <Text fontSize="sm">
            © {new Date().getFullYear()} Not Shopee. All rights reserved.
          </Text>
            <Text fontSize="xs" color="gray.500">
                Made with ❤️ by jjinnspecs
            </Text>

          <HStack spacing={4}>
            <Link href="https://github.com/jjinnspecs" isExternal>
              <IconButton aria-label="GitHub" icon={<FaGithub />} variant="ghost" />
            </Link>
            <Link href="https://www.linkedin.com/in/jeric-cariaso/" isExternal>
              <IconButton aria-label="LinkedIn" icon={<FaLinkedin />} variant="ghost" />
            </Link>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
