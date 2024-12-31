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
import { getAuth } from "firebase/auth";
import { auth, db, storage } from "../../config/firebaseConfig";
import { useGlobalContext } from "../../context/GlobalProvider";
import { uploadBytes } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CustomButton from "./../../components/CustomButton";
import { router } from "expo-router";

const PostScreen = () => {
  const { user, setUser } = useGlobalContext();

  const auth = getAuth();
  const userFromFB = auth.currentUser;
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("order");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("negotiable");
  const [locationFrom, setLocationFrom] = useState("Anywhere");
  const [locationTo, setLocationTo] = useState("AddisAbaba");
  const [image, setImage] = useState(null);
  const [contactInfo, setContactInfo] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const checkEmailVerification = async () => {
    if (!userFromFB) {
      console.log("not found");
      return false;
    }
    await userFromFB.reload(); // Reload user data
    return userFromFB.emailVerified;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        Alert.alert("You must be logged in to create a post.");
        return;
      }

      if (!description || !category || !price || !contactInfo) {
        Alert.alert("Please fill all required fields.");
        return;
      }

      const emailVerified = await checkEmailVerification();
      if (!emailVerified) {
        Alert.alert(
          "Email Verification Required",
          "Please check your email to verify before posting."
        );
        return;
      }

      setUser({ ...user, emailVerified: true });

      let downloadURL = null; // Initialize downloadURL

      if (image) {
        const storageRef = ref(storage, `images/${new Date().toISOString()}`);
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef); // Get the download URL
      }

      const postData = {
        description,
        postType,
        category,
        price,
        locationFrom,
        locationTo,
        image: downloadURL, // Store the image URL (null if no image)
        contactInfo,
        creatorUid: user?.uid,
        timestamp: new Date(),
        username: user?.fullname,
      };

      await addDoc(collection(db, "posts"), postData);
      Alert.alert("Post created successfully");
      setCategory("");
      setContactInfo("");
      setDescription("");
      setImage("");
      setLocationFrom("");
      setLocationTo("");
      setPrice("");
      router.push("/Travlers");
    } catch (error) {
      console.error("Error posting", error);
      Alert.alert("Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="p-5 bg-white pb-12 ">
      <View className="md:w-[75%] md:mx-auto">
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
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded"
              />
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
          containerStyles="mt-6 bg-Primary mb-[149px]"
          textStyles="text-white"
        />
      </View>
    </ScrollView>
  );
};

export default PostScreen;
