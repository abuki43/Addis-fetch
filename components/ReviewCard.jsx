import React from "react";
import { View, Text } from "react-native";
import StarRating from "react-native-star-rating-widget";

const ReviewCard = ({ review }) => {
  return (
    <View className="p-4 bg-white shadow rounded mb-2">
      <Text className="text-lg font-bold">{review?.reviewerName}</Text>
      <StarRating
        rating={review?.rating}
        starSize={20}
        color="gold"
        className="my-2"
        disabled={true}
      />
      <Text className="text-gray-700">{review?.description}</Text>
      <Text className="text-gray-400 text-sm mt-4 text-end">
        {review?.timestamp.toDate().toDateString()}
      </Text>
    </View>
  );
};

export default ReviewCard;
