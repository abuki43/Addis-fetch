import React from "react";
import { Tabs } from "expo-router";
import { View, Image, Text, StyleSheet, SafeAreaView } from "react-native";
import icons from "../../constants/icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { StatusBar } from "expo-status-bar";

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
          tabBarActiveTintColor: "#f69f3d",
          tabBarInactiveTintColor: "white",
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
                  { backgroundColor: focused ? "#f69f3d" : "#ffffff" },
                ]}
              >
                <TabIcon
                  icon={icons.plus}
                  color={focused ? "white" : "#f69f3d"}
                  name="Post"
                  focused={focused}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? "#EA9050" : "white",
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
      <StatusBar style="dark" />
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
    height: 67,
    borderRadius: 15,
    marginHorizontal: 10,
    position: "absolute",
    bottom: 12,
    left: 7,
    right: 7,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    marginTop: -64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: "#f69f3d",
  },
});

export default TabLayout;
