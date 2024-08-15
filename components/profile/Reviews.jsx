import { View, Text, FlatList } from "react-native";
import ReviewCard from "../ReviewCard";
import { SectionList } from "react-native";

import React from "react";

const Reviews = ({ reviews }) => {
  return (
    <View className="flex-1 p-4 bg-white">
      {reviews.length === 0 ? (
        <Text className="text-center text-gray-500">No reviews yet.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      )}
    </View>
  );
};

export default Reviews;
