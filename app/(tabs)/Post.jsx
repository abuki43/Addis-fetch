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
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import CustomButton from "./../../components/CustomButton";
import { router } from "expo-router";
import FormField from './../../components/FormField';

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

      const countCharacters = (str) => str.split("").length;

      if (
        countCharacters(description) > 400 ||
        countCharacters(category) > 50 ||
        countCharacters(price) > 10 ||
        countCharacters(contactInfo) > 100
      ) {
        Alert.alert("Character limit exceeded in one or more fields.");
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
    <ScrollView className="bg-white">
      <View className="p-6 md:w-3/4 md:mx-auto pb-12">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center">
            Create a New Post
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Share your travel plans or requirements
          </Text>
        </View>

        {/* Post Type Selection */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-gray-700 mb-3">
            Post Type
          </Text>
          <View className="flex-row space-x-4">
            {["order", "traveler"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setPostType(type)}
                className={`flex-1 py-4 rounded-xl ${
                  postType === type ? "bg-Primary" : "bg-gray-100"
                } active:opacity-90`}
              >
                <Text
                  className={`text-center font-semibold ${
                    postType === type ? "text-white" : "text-gray-600"
                  } capitalize`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Field */}
        <FormField
          title="Description"
          value={description}
          handleChangeText={setDescription}
          placeholder="Share the details of your post..."
          multiline
          numberOfLines={4}
          otherStyles="mb-6"
          textAlignVertical="top"
        />

        {/* Category Field */}
        <FormField
          title="Category"
          value={category}
          handleChangeText={setCategory}
          placeholder="e.g., Electronics, Clothing, etc."
          otherStyles="mb-6"
        />

        {/* Price Field */}
        <FormField
          title="Price"
          value={price}
          handleChangeText={setPrice}
          placeholder="Enter price or 'Negotiable'"
          otherStyles="mb-6"
        />

        {/* Location From Field */}
        <FormField
          title={
            postType === "traveler"
              ? "From Where You Are Coming"
              : "Where You Want the Item From"
          }
          value={locationFrom}
          handleChangeText={setLocationFrom}
          placeholder="Enter location"
          otherStyles="mb-6"
        />

        {/* Location To Field */}
        <FormField
          title={
            postType === "traveler"
              ? "To Where You Are Going"
              : "Where You Live"
          }
          value={locationTo}
          handleChangeText={setLocationTo}
          placeholder="Enter location"
          otherStyles="mb-6"
        />

        {/* Image Upload */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-700 mb-2">
            Image
          </Text>
          <TouchableOpacity
            onPress={handleImagePick}
            className={`border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center h-48 ${
              image ? "" : "bg-gray-50"
            }`}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <Ionicons
                  name="cloud-upload-outline"
                  size={40}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 mt-2">Tap to upload image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Contact Info Field */}
        <FormField
          title="Contact Info"
          value={contactInfo}
          handleChangeText={setContactInfo}
          placeholder="How can people reach you?"
          otherStyles="mb-6"
        />

        {/* Submit Button */}
        <CustomButton
          title="Create Post"
          handlePress={handleSubmit}
          isLoading={isLoading}
          containerStyles="mt-8 bg-Primary rounded-xl py-4 mb-12"
          textStyles="text-white font-bold text-lg"
        />
      </View>
    </ScrollView>
  );
};

export default PostScreen;
