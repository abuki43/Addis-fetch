import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native";
import PostCard from "../../components/TravelerCard";
import { StyleSheet } from "react-native";

const ProfileActivities = ({ posts }) => {
  return (
    <View className="p-5">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
});

export default ProfileActivities;
