"use client";

import Header from "./_components/Header";
import React, { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userDetail, setUserDetail] = useState<any>();
  const CreateUser = useMutation(api.user.CreateNewUser);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const createNewUser = async () => {
      const result = await CreateUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user.imageUrl,
        name: user.fullName ?? "",
      });
      setUserDetail(result);
    };

    createNewUser();
  }, [user?.id]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>
        <Header />
        {children}
      </div>
    </UserDetailContext.Provider>
  );
}

export const useUserDetail = () => {
  return useContext(UserDetailContext);
};