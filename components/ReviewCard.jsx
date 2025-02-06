import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StarRatingDisplay from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";

const ReviewCard = ({ review }) => {
  const isDeletedUser = review?.reviewerName === "Deleted User";

  return (
    <View className="bg-white rounded-2xl p-6 mb-3" style={styles.card}>
      <View className="flex-row items-center mb-3">
        <View
          className={`h-10 w-10 rounded-full ${
            isDeletedUser ? "bg-gray-400" : "bg-Primary"
          } justify-center items-center`}
        >
          <Text className="text-white font-bold">
            {review?.reviewerName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-gray-800">
              {review?.reviewerName}
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <StarRatingDisplay
              rating={review?.rating}
              starSize={18}
              onChange={() => {}}
              color="#F59E0B"
              className="mr-2"
            />
            <Text className="text-amber-500 font-medium">
              {review?.rating.toFixed(1)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text className="text-gray-400 text-sm ml-1">
            {review?.timestamp.toDate().toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 leading-6 mt-2">
        {review?.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default ReviewCard;
