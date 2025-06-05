import {
  Box,
  Flex,
  Text,
  Button,
  Spacer,
  HStack,
  VStack,
  Link as ChakraLink,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore} from "../src/store/auth";
import { useEffect } from "react";

function getStoredUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr || userStr === "undefined") return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

const navLinks = [
  { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Categories", path: "/admin/category" },
  { label: "Orders", path: "/admin/orders" },
];

const AdminNavbar = () => {
  const { user: storeUser, token: storeToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onToggle } = useDisclosure();

  // get current user from store or localStorage
  const currentUser = storeUser || getStoredUser();
  const currentToken = storeToken || localStorage.getItem("token");

  useEffect(() => {
    // console.log('AdminNavbar auth check:', { currentToken, currentUser }); // debug log
    
    if (!currentToken || !currentUser || currentUser.role !== "admin") {
      // console.log('Auth failed in navbar, redirecting to login');
      navigate("/admin/login");
    }
  }, [navigate, currentToken, currentUser]);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const brandColor = useColorModeValue("teal.600", "teal.300");
  const hoverBg = useColorModeValue("teal.50", "teal.900");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const NavLinkItem = ({ label, path }) => (
    <ChakraLink
      as={Link}
      to={path}
      px={3}
      py={2}
      rounded="md"
      fontWeight={isActive(path) ? "bold" : "medium"}
      color={isActive(path) ? brandColor : textColor}
      bg={isActive(path) ? hoverBg : "transparent"}
      _hover={{
        textDecoration: "none",
        bg: hoverBg,
        color: brandColor,
        transform: "translateY(-1px)",
        transition: "all 0.2s",
      }}
    >
      {label}
    </ChakraLink>
  );

  const DesktopNav = () => (
    <HStack spacing={6} display={{ base: "none", md: "flex" }}>
      {navLinks.map((link) => (
        <NavLinkItem key={link.path} {...link} />
      ))}
    </HStack>
  );

  const MobileNav = () => (
    <Collapse in={isOpen} animateOpacity>
      <Box bg={bgColor} pb={4} borderTop="1px" borderColor={borderColor} display={{ md: "none" }}>
        <VStack spacing={1} align="start" px={4}>
          {navLinks.map((link) => (
            <NavLinkItem key={link.path} {...link} onClick={onToggle} />
          ))}
        </VStack>
      </Box>
    </Collapse>
  );

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} shadow="sm" position="sticky" top={0} zIndex={1000}>
      <Container maxW="container.xl">
        <Flex py={4} align="center">
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={brandColor}>
            Admin Panel
          </Text>

          <Spacer />
          <DesktopNav />

          <HStack spacing={4} paddingLeft={4}>
            <IconButton
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Toggle Navigation"
              variant="ghost"
              display={{ md: "none" }}
              onClick={onToggle}
              color={textColor}
            />

            {/* user menu for desktop */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                rightIcon={<ChevronDownIcon />}
                display={{ base: "none", md: "flex" }}
                _hover={{ bg: hoverBg }}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    name={currentUser?.name || currentUser?.username || "Admin"}
                    bg={brandColor}
                    color="white"
                  />
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {currentUser?.name || currentUser?.username || "Admin"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Administrator
                    </Text>
                  </VStack>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <VStack spacing={0} align="start">
                    <Text fontWeight="medium">{currentUser?.role || "Admin"}</Text>
                    {/* <Text fontSize="sm" color="gray.500">{user?.email || "admin@system.com"}</Text> */}
                  </VStack>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => navigate("/admin/profile")}>Profile Settings</MenuItem>
                <MenuItem onClick={() => navigate("/admin/settings")}>System Settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout} color="red.500">Sign Out</MenuItem>
              </MenuList>
            </Menu>

            {/* mobile logout button */}
            <Button
              display={{ md: "none" }}
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </HStack>
        </Flex>
      </Container>

      <MobileNav />
    </Box>
  );
};

export default AdminNavbar;
