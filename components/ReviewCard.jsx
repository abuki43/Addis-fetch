import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StarRatingDisplay from "react-native-star-rating-widget";

const ReviewCard = ({ review }) => {
  return (
    <View
      className="p-4 bg-white  rounded mb-2 shadow-black"
      style={styles.Card}
    >
      <Text className="text-lg font-bold">{review?.reviewerName}</Text>
      <StarRatingDisplay
        rating={review?.rating}
        starSize={20}
        onChange={() => {}}
        color="gold"
        className="my-2"
      />
      <Text className="text-gray-700">{review?.description}</Text>
      <Text className="text-gray-400 text-sm mt-4 text-end">
        {review?.timestamp.toDate().toDateString()}
      </Text>
    </View>
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

export default ReviewCard;
