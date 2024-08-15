import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import { auth, db, storage } from "../../config/firebaseConfig";
import { useGlobalContext } from "../../context/GlobalProvider";
import { uploadBytes } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CustomButton from "./../../components/CustomButton";

const PostScreen = () => {
  const { user } = useGlobalContext();

  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("order");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [locationFrom, setLocationFrom] = useState("Anywhere");
  const [locationTo, setLocationTo] = useState("AddisAbaba");
  const [image, setImage] = useState(null);
  const [contactInfo, setContactInfo] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    console.log("HANDLESUBMIT");
    if (!description || !category || !price || !contactInfo || !image) {
      Alert.alert("Please fill all required fields.");
      return;
    }

    if (!user) {
      Alert.alert("You must be logged in to create a post.");
      return;
    }
    try {
      setIsLoading(true);
      const storageRef = ref(storage, `images/${new Date().toISOString()}`);

      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      const postData = {
        description,
        postType,
        category,
        price,
        locationFrom,
        locationTo,
        image: downloadURL, // Store the image URL
        contactInfo,
        creatorUid: user?.uid,
        timestamp: new Date(),
        username: user.displayName,
      };
      await addDoc(collection(db, "posts"), postData);
      Alert.alert("Post created successfully");
    } catch (error) {
      console.error("Error posting", error);
      Alert.alert("Error creating post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="p-5 bg-white ">
      <Text className="text-2xl font-bold text-center mb-5">
        Create a New Post
      </Text>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          className="border border-gray-300 p-3 rounded text-base h-32"
          placeholder="Enter description"
          multiline
        />
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">Post Type</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => setPostType("order")}
            className={`flex-1 items-center p-3 rounded border ${
              postType === "order"
                ? "bg-Primary border-Primary"
                : "bg-gray-200 border-gray-300"
            } mx-1`}
          >
            <Text
              className={`${
                postType === "order" ? "text-white" : "text-black"
              } text-base`}
            >
              Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPostType("traveler")}
            className={`flex-1 items-center p-3 rounded border ${
              postType === "traveler"
                ? "bg-Primary border-Primary"
                : "bg-gray-200 border-gray-300"
            } mx-1`}
          >
            <Text
              className={`${
                postType === "traveler" ? "text-white" : "text-black"
              } text-base`}
            >
              Traveler
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          className="border border-gray-300 p-3 rounded text-base"
          placeholder="Enter category"
        />
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          className="border border-gray-300 p-3 rounded text-base"
          placeholder="Enter price"
          keyboardType="numeric"
        />
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">
          {postType === "traveler"
            ? "From Where You Are Coming"
            : "Where You Want the Item From"}
        </Text>
        <TextInput
          value={locationFrom}
          onChangeText={setLocationFrom}
          className="border border-gray-300 p-3 rounded text-base"
          placeholder="Enter location"
        />
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">
          {postType === "traveler"
            ? "To Where You Are Going"
            : "Where You Live"}
        </Text>
        <TextInput
          value={locationTo}
          onChangeText={setLocationTo}
          className="border border-gray-300 p-3 rounded text-base"
          placeholder="Enter location"
        />
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">Image</Text>
        <TouchableOpacity
          onPress={handleImagePick}
          className="border border-gray-300 p-3 rounded items-center justify-center h-40 mt-2"
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full rounded" />
          ) : (
            <Ionicons name="camera" size={32} color="gray" />
          )}
        </TouchableOpacity>
      </View>
      <View className="mb-5">
        <Text className="text-lg mb-2 text-gray-700">Contact Info</Text>
        <TextInput
          value={contactInfo}
          onChangeText={setContactInfo}
          className="border border-gray-300 p-3 rounded text-base"
          placeholder="Enter contact info"
        />
      </View>

      <CustomButton
        title="Create post"
        handlePress={handleSubmit}
        isLoading={isLoading}
        containerStyles="mt-6 bg-Primary mb-9"
        textStyles="text-white"
      />
    </ScrollView>
  );
};

export default PostScreen;
