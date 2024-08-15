import React, { useState, useEffect } from "react";
import { View, Text, Switch } from "react-native";
import registerForPushNotificationsAsync from "../../lib/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "./../../context/GlobalProvider";

const SettingOptions = () => {
  const { user } = useGlobalContext();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const storedToken = await AsyncStorage.getItem("pushToken");
  //     if (storedToken) {
  //       setNotificationEnabled(true);
  //     }
  //   };
  //   fetchToken();
  // }, []);

  const handleNotificationToggle = async () => {
    if (notificationEnabled) {
      await AsyncStorage.removeItem("pushToken");
      setNotificationEnabled(false);
    } else {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        // Save the token to Firestore for sending notifications later
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { pushToken: token });
        setNotificationEnabled(true);
      }
    }
  };

  return (
    <View className="p-5">
      <View className="flex-row justify-between items-center my-2">
        <Text className="text-lg">Enable Notification</Text>
        <Switch value={notificationEnabled} />
      </View>
      <View className="flex-row justify-between items-center my-2">
        <Text className="text-lg">Dark mode</Text>
        <Switch value={darkMode} />
      </View>
    </View>
  );
};

export default SettingOptions;
