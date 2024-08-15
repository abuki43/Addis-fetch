import React from "react";
import { Tabs } from "expo-router";
import { View, Image, Text, StyleSheet, SafeAreaView } from "react-native";
import icons from "../../constants/icons";
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, color, name, focused }) => (
  <View style={styles.iconContainer}>
    <Image source={icon} style={[styles.icon, { tintColor: color }]} />
    {name !== "Post" && (
      <Text style={[styles.iconLabel, { color }]}>{name}</Text>
    )}
  </View>
);

const TabLayout = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F5F5F5",
          tabBarInactiveTintColor: "#35424a",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="Travlers"
          options={{
            title: "Travlers",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.globe}
                color={color}
                name="Travlers"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Orders"
          options={{
            title: "Orders",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.track}
                color={color}
                name="Orders"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Post"
          options={{
            title: "Post",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.postIconContainer,
                  { backgroundColor: focused ? "#FFA001" : "gray" },
                ]}
              >
                <TabIcon
                  icon={icons.plus}
                  color="#FFF"
                  name="Post"
                  focused={focused}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? "#FFA001" : "#CDCDE0",
                  marginTop: -20,
                }}
              >
                Post
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="Messages"
          options={{
            title: "Messages",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.message}
                color={color}
                name="Messages"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
  },
  tabBar: {
    backgroundColor: "#161622",
    borderTopWidth: 1,
    borderTopColor: "#232533",
    height: 70, // Decrease the height of the nav
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  postIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60, // Adjust this value to center the circle
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default TabLayout;
