import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native";
import PostCard from "../../components/postCard";
import { StyleSheet } from "react-native";

const ProfileActivities = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);

  return (
    <View className="p-5 bg-white pb-11">
      <View style={styles.scrollContainer}>
        {posts.length === 0 || !posts ? (
          <Text className="text-center text-gray-500">No posts yet.</Text>
        ) : (
          posts.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              setPosts={setPosts}
              isProfileView={true}
            />
          ))
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
