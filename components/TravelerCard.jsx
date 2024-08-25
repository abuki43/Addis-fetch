import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const PostCard = ({ post }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const handleContact = () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to contact the user.");
      return;
    }

    router.push(
      `/PrivateChat?UID=${post.creatorUid}&fullname=${post.username}`
    );
  };

  const convertTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return "";
  };

  let profileLink =
    user?.uid == post.creatorUid
      ? `/Profile`
      : `/OthersProfile?UID=${post.creatorUid}`;

  return (
    <>
      <View
        className="bg-white rounded-lg p-2 shadow-lg mb-6 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        style={styles.Card}
      >
        {post.image && (
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image
              source={{ uri: post.image }}
              className="w-full h-60 rounded-md"
              contentFit="cover"
            />
          </TouchableOpacity>
        )}
        <View className="p-4">
          <Link href={profileLink} asChild>
            <TouchableOpacity>
              <Text className="text-xl font-bold text-Primary mb-2">
                {post.username}
              </Text>
            </TouchableOpacity>
          </Link>
          <Text className="text-gray-700 mb-4">{post.description}</Text>
          <View className="mb-4">
            <Text className="text-sm text-gray-500">
              {convertTimestamp(post.timestamp)}
            </Text>
            <Text className="text-sm text-gray-500">
              From:- {post.locationFrom}
            </Text>
            <Text className="text-sm text-gray-500">
              To:- {post.locationTo}
            </Text>

            <Text className="text-sm font-bold text-gray-700">
              Category: {post.category}
            </Text>
            <Text className="text-lg font-bold text-Primary">
              Price: ${post.price}
            </Text>
          </View>
          {post.creatorUid != user?.uid && (
            <TouchableOpacity
              className="bg-Primary rounded-lg p-3"
              onPress={handleContact}
            >
              <Text className="text-white text-center font-bold">Contact</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-80 ">
          <Image
            source={{ uri: post.image }}
            className="w-11/12 h-3/4"
            contentFit="cover"
          />
          <TouchableOpacity
            onPress={() => setImageModalVisible(false)}
            className="mt-4 bg-white rounded-full p-3"
          >
            <Text className="text-center text-black font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  Card: {
    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.3, // iOS
    shadowRadius: 3.84, // iOS
  },
});

export default PostCard;
