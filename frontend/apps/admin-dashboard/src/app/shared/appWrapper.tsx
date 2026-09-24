"use client";
import authService from "@/services/authService";
import {
  authLoadingAtom,
  currentUserAtom,
  isAuthenticatedAtom,
} from "@/store/authAtom";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";

const AppWrapper = ({ children }: any) => {
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);
  const [loading, setLoading] = useState(true);

  const [currentUser] = useAtom(currentUserAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  useEffect(() => {
    const fetchProfile = async () => {
      setAuthLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user); // Update atom with fetched user
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
        setAuthLoading(false);
      }
    };
    fetchProfile();
  }, []);

  //   console.log(currentUser, "----------------Currentuser-----------------");

  if (!loading) return <>{children}</>;
};

export default AppWrapper;
