import { View, Text } from "react-native";
import ReviewCard from "../ReviewCard";

import React from "react";

const Reviews = ({ reviews }) => {
  console.log("reviews", reviews);
  return (
    <View className="flex-1 p-4 bg-white">
      {reviews.length === 0 || !reviews ? (
        <Text className="text-center text-gray-500">No reviews yet.</Text>
      ) : (
        reviews &&
        reviews.map((item) => <ReviewCard key={item.id} review={item} />)
      )}
    </View>
  );
};

export default Reviews;
