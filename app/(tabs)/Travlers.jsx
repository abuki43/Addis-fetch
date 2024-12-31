import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "../../components/postCard";
import usePosts from "../../lib/fetchPosts";
import MasonryList from "@react-native-seoul/masonry-list";

const TravlersScreen = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    posts,
    filteredPosts,
    setFilteredPosts,
    loading,
    refreshing,
    error,
    hasMore,
    onRefresh,
    handleLoadMore,
    applyFilters,
  } = usePosts("traveler", searchQuery);

  const handleApplyFilters = () => {
    applyFilters(searchQuery);
    setSearchVisible(false);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSearchVisible(false);
    setFilteredPosts(posts);
  };

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
    <SafeAreaView className="flex-1 bg-gray-100 pb-16">
      <View className={isTablet ? "p-7 " : "p-2"}>
        <TouchableOpacity
          onPress={() => setSearchVisible(true)}
          className="bg-white rounded-lg p-3 flex-row items-center shadow md:p-5 md:h-14 md:w-3/4 md:mx-auto "
        >
          <Text className="text-gray-600 text-sm md:text-xs">Search...</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing && posts.length === 0 ? (
        <ActivityIndicator size="large" color="#EA9050" />
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">{error}</Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-orange-500 rounded-lg p-2 mt-4"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredPosts.length === 0 && !loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">No post found</Text>
          {searchQuery && (
            <TouchableOpacity
              onPress={handleResetSearch}
              className="flex-row items-center justify-center mt-4 mb-2 "
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="ml-2  text-gray-600">Back to All Orders</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-orange-500 rounded-lg px-4 py-2 mt-4"
          >
            <Text className="text-white">Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {searchQuery && (
            <View className="pl-4 bg-gray-100 ">
              <TouchableOpacity
                onPress={handleResetSearch}
                className="flex-row items-center justify-center rounded-lg mb-2 "
              >
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text className="ml-2 text-gray-600">Back to All Orders</Text>
              </TouchableOpacity>
            </View>
          )}
          <MasonryList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View style={styles.cardContainer}>
                  <PostCard post={item} />
                </View>
              );
            }}
            contentContainerStyle={styles.flatlistStyle}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              hasMore && !loading && posts.length > 0 ? (
                <ActivityIndicator size="large" color="#EA9050" />
              ) : null
            }
            numColumns={column}
            initialNumToRender={10}
            windowSize={5}
          />
        </>
      )}

      <Modal
        visible={searchVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={styles.modalOverlay}
        >
          <View className="w-4/5 p-5 bg-white rounded-lg  md:w-3/5 md:mx-auto">
            <TextInput
              placeholder="Search items and places ..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="border border-gray-300 rounded-lg p-2 mb-2"
            />
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="bg-Secondary p-2 rounded-lg items-center w-32 mx-auto"
            >
              <Text className="text-white">Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSearchVisible(false)}
              className="mt-2 items-center"
            >
              <Text className="text-gray-500">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  flatlistStyle: {
    paddingHorizontal: 10,
    marginTop: 8,
  },
  cardContainer: {
    flex: 1,
    margin: 3,
    marginHorizontal: 10,
    // maxWidth: "48%",
  },
});

export default TravlersScreen;
