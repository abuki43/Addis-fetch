import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileCircle = ({ fullname }) => {
  // Get the first letter of the first name for the circle
  const firstLetter = fullname ? fullname.charAt(0).toUpperCase() : "?";

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.text}>{firstLetter}</Text>
      </View>
      <Text style={styles.fullname}>{fullname}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3498db", // Circle background color
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  text: {
    fontSize: 24,
    color: "#fff", // Text color inside the circle
    fontWeight: "bold",
  },
  fullname: {
    fontSize: 16,
    color: "#333", // Text color below the circle
  },
});

export default ProfileCircle;
