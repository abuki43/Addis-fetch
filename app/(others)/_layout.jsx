import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const othersLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="ReviewPage" options={{ headerShown: true }} />
        <Stack.Screen name="OthersProfile" options={{ headerShown: true }} />
        <Stack.Screen name="PrivateChat" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default othersLayout;
