import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const othersLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="OthersProfile" options={{ headerShown: true }} />
        <Stack.Screen name="PrivateChat" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default othersLayout;
