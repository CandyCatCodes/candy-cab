// import { Stack } from "expo-router";
/*Clerk*/
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
/*Clerk*/

import { JSX } from "react";

export default function AuthRoutesLayout(): JSX.Element {
  /*Clerk*/
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }
  /*Clerk*/
  return (
    <Stack>
      <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
      <Stack.Screen name="(sign-up)" options={{ headerShown: false }} />
      <Stack.Screen name="(sign-in)" options={{ headerShown: false }} />
    </Stack>
  );
}
