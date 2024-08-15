import { StyleSheet, Text, View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "../lib/notification";
import GlobalProvider from "../context/GlobalProvider";

const RootLayout = () => {
  // useEffect(() => {
  //   // Register for push notifications on app load
  //   registerForPushNotificationsAsync();

  //   // Handle incoming notifications
  //   const subscription = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       console.log("Notification Received:", notification);
  //       // You can display an alert or update state based on the notification data
  //     }
  //   );

  //   // Handle notification responses (when the user interacts with the notification)
  //   const responseSubscription =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log("Notification Response:", response);
  //       // Handle the notification response, such as navigating to a specific screen
  //     });

  //   // Cleanup listeners on unmount
  //   return () => {
  //     subscription.remove();
  //     responseSubscription.remove();
  //   };
  // }, []);
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(others)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
