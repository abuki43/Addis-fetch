import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useGlobalContext } from "../../context/GlobalProvider";
import StarRating from "react-native-star-rating-widget";
import { useLocalSearchParams } from "expo-router";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

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
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-500 font-medium">
          Cannot find the user
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4 pt-2">
          {/* Header */}
          <View className="mb-4">
            <Text className="text-3xl font-bold text-gray-800">
              Write a Review
            </Text>
            <Text className="text-gray-500 mt-2">
              Share your experience to help others
            </Text>
          </View>

          {/* Rating Section */}
          <View className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Rate your experience
            </Text>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={32}
              color="#FFD700"
              enableHalfStar={false}
            />
          </View>

          {/* Description Section */}
          <View className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <FormField
              title="Your Review"
              value={description}
              handleChangeText={setDescription}
              placeholder="Tell us about your experience..."
              multiline
              numberOfLines={6}
              otherStyles="m-0 mb-0"
              textAlignVertical="top"
            />
          </View>

          {/* Buttons Container */}
          <View className="flex-row justify-between space-x-4 mt-4">
            {/* Submit Button */}
            <View className="flex-1">
              <CustomButton
                title="Submit Review"
                handlePress={handleSubmitReview}
                isLoading={laoding}
                containerStyles="bg-Primary py-4 rounded-xl shadow-lg"
                textStyles="text-white font-bold text-lg"
              />
            </View>

            {/* Cancel Button */}
            <View className="flex-1">
              <CustomButton
                title="Cancel"
                handlePress={() => router.back()}
                containerStyles="bg-gray-200 py-4 rounded-xl shadow-lg"
                textStyles="text-gray-700 font-bold text-lg"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewPage;