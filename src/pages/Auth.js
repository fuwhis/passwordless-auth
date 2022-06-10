import React, { useState } from "react";
import {
  Box,
  Link,
  Image,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  Text,
} from "@chakra-ui/core";
import { RepeatIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import OtpInput from "react-otp-input";

import Layout from "../Layout";
import { otpStart, otpLogin } from "../services";
import { useDocTitle } from "../useDocTitle";
import { useToasts } from "react-toast-notifications";
import { validateEmail } from "../helpers";
import logo from "../logo.png";

const Auth = () => {
  useDocTitle("Auth | Passwordless Authentication");
  const darkMode = JSON.parse(localStorage.getItem("darkMode"));

  const { addToast } = useToasts();

  const [formState, setFormState] = useState({
    email: "",
    otp: "",
    otpAvailable: false,
    isSubmitting: false,
  });

  const [formFieldsErrors, setFormFieldsError] = useState({
    email: "",
    otp: "",
  });

  const onBlur = (e) => {
    switch (e.target.name) {
      case "email":
        if (!e.target.value) {
          setFormFieldsError({
            ...formFieldsErrors,
            [e.target.name]: "Email is required",
          });
        } else if (e.target.value && !validateEmail(e.target.value)) {
          setFormFieldsError({
            ...formFieldsErrors,
            [e.target.name]: "Email is not valid",
          });
        } else {
          setFormFieldsError({
            ...formFieldsErrors,
            [e.target.name]: "",
          });
        }
        break;
      default:
        break;
    }
  };

  const onChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    onBlur(e);
  };

  const requestOtp = async (email) => {
    if (email && validateEmail(email)) {
      setFormState({ ...formState, isSubmitting: true, otpAvailable: false });
      try {
        await otpStart({ email });
        addToast(`OTP Code has been sent to ${email}`, {
          appearance: "success",
          autoDismiss: true,
        });
        setFormState({ ...formState, isSubmitting: false, otpAvailable: true });
      } catch (err) {
        addToast(
          `${
            err?.error_description || "Something went wrong. Please try again."
          }`,
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
        setFormState({ ...formState, isSubmitting: false });
      }
    }
  };

  const login = async ({ email, otp }) => {
    setFormState({ ...formState, isSubmitting: true });
    try {
      await otpLogin({ otp, email });
    } catch (err) {
      addToast(
        `${
          err?.error_description || "Something went wrong. Please try again."
        }`,
        {
          appearance: "error",
          autoDismiss: true,
        }
      );
    }
    setFormState({ ...formState, isSubmitting: false });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { email, otp, otpAvailable } = formState;

    if (otpAvailable) {
      login({ email, otp });
    } else {
      requestOtp(email);
    }
  };

  const displayOtpInput = () => {
    setFormState({ ...formState, otpAvailable: true });
  };

  return (
    <Layout hideHeader={true}>
      <Box
        margin="0 auto"
        maxWidth={["22rem", "22rem", "25rem", "25rem"]}
        textAlign="center"
      >
        <Box
          width="100%"
          padding="1rem 2rem 2rem"
          borderRadius="5px"
          bg={darkMode ? "gray.900" : "gray.50"}
          marginBottom="5px"
        >
          <Text display="flex" justifyContent="center">
            <Link
              textAlign="center"
              as={RouterLink}
              to="/"
              _hover={{ textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
            >
              <Image size="6rem" src={logo} alt="logo" />
            </Link>
          </Text>
          <form style={{ marginTop: "2rem" }} onSubmit={onSubmit}>
            <FormControl
              mb={5}
              textAlign="left"
              isInvalid={formFieldsErrors.email ? true : false}
            >
              <Box d="flex" justifyContent="space-between" alignItems="center">
                <FormLabel htmlFor="email">Email Address</FormLabel>
                {formState.otpAvailable &&
                  formState.email &&
                  validateEmail(formState.email) && (
                    <Button
                      type="button"
                      bg="transparent"
                      padding="0"
                      fontSize="0.9rem"
                      fontWeight="400"
                      ml="0.3rem"
                      textAlign="center"
                      to="/auth"
                      _focus={{ outline: "none" }}
                      color="#81E6D9"
                      onClick={() => requestOtp(formState.email)}
                      d="flex"
                      alignItems="center"
                    >
                      <RepeatIcon mr="0.3rem" />
                      <span>Resend</span>
                    </Button>
                  )}
              </Box>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="johndoe@domain.com"
                value={formState.email}
                onChange={onChange}
                onBlur={onBlur}
              />
              <FormErrorMessage>{formFieldsErrors.email}</FormErrorMessage>
            </FormControl>
            {formState.otpAvailable && (
              <FormControl mb={8} textAlign="left" className="otp-input">
                <FormLabel htmlFor="otp">OTP Code</FormLabel>
                <OtpInput
                  value={formState.otp}
                  onChange={(otp) => setFormState({ ...formState, otp })}
                  numInputs={6}
                  isInputNum={true}
                  isDisabled={!true}
                />
              </FormControl>
            )}
            <Button
              mt={4}
              variantColor="teal"
              isLoading={formState.isSubmitting}
              type="submit"
              w="100%"
              isDisabled={formState.isSubmitting}
              onClick={onSubmit}
            >
              <span>{formState.otpAvailable ? "Login" : "Request Access"}</span>
            </Button>
          </form>
        </Box>
        <Text
          fontSize="0.9rem"
          d="flex"
          alignItems="center"
          justifyContent="center"
        >
          <span>Already have a code?</span>{" "}
          <Button
            bg="transparent"
            padding="0"
            fontSize="0.9rem"
            fontWeight="400"
            ml="0.3rem"
            textAlign="center"
            to="/auth"
            _focus={{ outline: "none" }}
            color="#81E6D9"
            onClick={displayOtpInput}
          >
            Use Now
          </Button>
        </Text>
      </Box>
    </Layout>
  );
};

export default Auth;
