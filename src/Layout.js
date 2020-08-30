import React from "react";
import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  theme,
  Flex,
  Button,
  Box,
  Link,
  Image,
} from "@chakra-ui/core";
import { Link as RouterLink } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import logo from "./logo.png";

const Header = () => {
  const isAuthenticated = false;
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="0 1.2rem"
    >
      <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
        <Image size="2.5rem" src={logo} alt="logo" />
      </Link>
      <Flex align="center">
        <ThemeSwitcher />
        {!isAuthenticated ? (
          <Button bg="transparent" border="1px" as={RouterLink} to="/login">
            Login
          </Button>
        ) : (
          <Button bg="transparent" border="1px">
            Logout
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

const Layout = ({ children, hideHeader = false }) => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        {!hideHeader ? <Header /> : null}
        <Box padding="10rem 0" margin="0 auto" maxWidth="1280px">
          {children}
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default Layout;