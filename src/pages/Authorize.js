import React, { useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

import Loader from "../Loader";
import { logout, webAuth } from "../services";
import { StoreContext } from "../store";
// react-hooks/exhausting-deps
const Authorize = () => {
  const { authenticateUser, setUserData, isAuthenticated, resetAuth } =
    useContext(StoreContext);

  const parseAuthToken = () => {
    if (window.location.hash) {
      webAuth.parseHash({ hash: window.location.hash }, (err, res) => {
        console.log(err);
        console.log(res);
        if (err) {
          resetAuth();
          logout();
          return;
        }

        const { email, name, picture, sub: id } = res.idTokenPayload;
        setUserData({ email, name, picture, id });
        authenticateUser(res.idToken);
      });
    }
  };

  useEffect(parseAuthToken, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthenticated) {
    console.log('isAuthenticated--Authorize', isAuthenticated)
    return <Redirect to="/dashboard" />;
  }

  return <Loader />;
};

export default Authorize;
