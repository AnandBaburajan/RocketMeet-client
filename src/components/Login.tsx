import React, { useState } from "react";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { RootState } from "../store/store";
import { auth, firebase } from "../utils/firebase";
import { login, logout } from "../store/auth/action";
import ResponseMessage from "./ResponseMessage";

const Login = (props: { btnStyle: string }): JSX.Element => {
  const { btnStyle } = props;
  const isLoggedIn = useSelector(
    (state: RootState) => state.authReducer.isLoggedIn
  );
  const [response, setResponse] = useState({
    status: false,
    type: "null",
    msg: "",
  });
  const dispatch = useDispatch();

  const googleLogin = async (): Promise<void> => {
    // 1 - init Google Auth Provider
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      // 2 - create the popup signIn
      await auth.signInWithPopup(provider).then(async () => {
        const user = auth.currentUser;
        // token generated
        const token = user && (await user.getIdToken());
        user &&
          dispatch(
            login({
              displayName: user.displayName,
              username: user.email,
              token,
            })
          );
        Router.push(`/dashboard`);
      });
    } catch (err) {
      setResponse({
        status: true,
        type: "error",
        msg:
          "Unable to connect to firebase. Make sure you have a stable internet connection",
      });
    }
  };

  const googleLogout = (): void => {
    firebase.auth().signOut();
    dispatch(logout());
  };

  return (
    <>
      {!isLoggedIn ? (
        <Button className={btnStyle} onClick={googleLogin}>
          Log in with Google
        </Button>
      ) : (
        <Button className={btnStyle} onClick={googleLogout}>
          Logout
        </Button>
      )}
      <ResponseMessage
        response={response}
        onHide={(): void =>
          setResponse({ status: false, type: "null", msg: "" })
        }
      />
    </>
  );
};

export default Login;
