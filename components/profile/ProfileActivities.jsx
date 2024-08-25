import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native";
import PostCard from "../../components/TravelerCard";
import { StyleSheet } from "react-native";

const ProfileActivities = ({ posts }) => {
  return (
    <View className="p-5 bg-white pb-11">
      <View style={styles.scrollContainer}>
        {posts.length === 0 || !posts ? (
          <Text className="text-center text-gray-500">No posts yet.</Text>
        ) : (
          posts.map((post, index) => <PostCard key={index} post={post} />)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 7,
    paddingVertical: 15,
  },
});

export default ProfileActivities;
