import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { ScrollView } from "react-native";
import PostCard from "../../components/postCard";
import { StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const ProfileActivities = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [column, setColumn] = useState(1);
  useEffect(() => {
    if (width >= 768) {
      setColumn(2);
    } else {
      setColumn(1);
    }
  }, [width]);

  const handleDelete = async (postId, setLoading) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const postDocRef = doc(db, "posts", postId);
              await deleteDoc(postDocRef);
              Alert.alert("Success", "Post deleted successfully!");
              setPosts([...posts.filter((post) => post.id !== postId)]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete post.");
              console.error("Error deleting post: ", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      className={`${
        isTablet && "p-5"
      } bg-white pb-11  md:mx-auto m-3 rounded-2xl`}
    >
      <View style={styles.scrollContainer}>
        {posts.length === 0 || !posts ? (
          <Text className="text-center text-gray-500">No posts yet.</Text>
        ) : (
          <MasonryList
            data={posts}
            numColumns={column}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="p-3 md:p-3 ">
                <PostCard
                  post={item}
                  isProfileView={true}
                  handleDelete={handleDelete}
                />
              </View>
            )}
          />
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
