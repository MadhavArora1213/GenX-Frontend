import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignOut = ({ provider }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOutUrl = `http://localhost:3000/auth/${provider}/signout`;
    fetch(signOutUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          navigate("/");
        } else {
          throw new Error("Failed to sign out");
        }
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }, [provider, navigate]);

  return <p>Signing out...</p>;
};

export default SignOut;
