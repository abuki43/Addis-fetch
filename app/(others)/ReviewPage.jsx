import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useGlobalContext } from "../../context/GlobalProvider";
import StarRating from "react-native-star-rating-widget";
import { useLocalSearchParams } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const ReviewPage = () => {
  const [laoding, setLoading] = useState(false);
  const { user } = useGlobalContext();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);

  const { reviewedPersonId } = useLocalSearchParams();

  const handleSubmitReview = async () => {
    if (!description || rating === 0) {
      Alert.alert("Error", "Please provide a description and a rating.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "reviews"), {
        reviewedPersonId,
        reviewerId: user?.uid,
        reviewerName: user?.fullname,
        description,
        rating,
        timestamp: new Date(),
      });

      Alert.alert("Success", "Your review has been submitted.");
      setDescription("");
      setRating(0);
      router.back();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  if (!reviewedPersonId) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500">Can not find the user</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100 pt-8">
      <Text className="text-xl font-bold mb-4">Write a Review</Text>

      <Text className="text-lg mb-2">Rating</Text>
      <StarRating
        rating={rating}
        onChange={setRating}
        starSize={30}
        color="gold"
        className="mb-4"
      />

      <Text className="text-lg mb-2">Description</Text>
      <TextInput
        className="border p-2 rounded bg-white mb-4"
        placeholder="Write your review here..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <CustomButton
        title="Submit Review"
        handlePress={handleSubmitReview}
        isLoading={laoding}
        containerStyles="mt-2 bg-Primary mb-2"
        textStyles="text-white"
      />
    </View>
  );
};

export default ReviewPage;
