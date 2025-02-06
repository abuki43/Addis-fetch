import { View, Text } from "react-native";
import ReviewCard from "../ReviewCard";
import MasonryList from "@react-native-seoul/masonry-list";
import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";

const Reviews = ({ reviews }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [column, setColumn] = useState(1);
  useEffect(() => {
    if (width >= 768) {
      setColumn(2);
    } else {
      setColumn(1);
    }
  }, [width]);
  return (
    <View
      className={`${
        isTablet && "p-5"
      } flex-1 bg-white  rounded-2xl m-3 pb-11 pt-5`}
    >
      {reviews.length === 0 || !reviews ? (
        <Text className="text-center text-gray-500">No reviews yet.</Text>
      ) : (
        reviews && (
          <MasonryList
            data={reviews}
            numColumns={column}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="p-3 md:p-3 ">
                <ReviewCard review={item} />
              </View>
            )}
          />
        )
      )}
    </View>
  );
};

export default Reviews;
