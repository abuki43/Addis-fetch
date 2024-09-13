import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "../../components/postCard";
import usePosts from "../../lib/fetchPosts";

const OrdersScreen = () => {
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
  } = usePosts("order", searchQuery);

  const handleApplyFilters = () => {
    applyFilters(searchQuery);
    setSearchVisible(false);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSearchVisible(false);
    setFilteredPosts(posts);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pb-16">
      <View className="p-4">
        <TouchableOpacity
          onPress={() => setSearchVisible(true)}
          className="bg-white rounded-lg p-3 flex-row items-center shadow"
        >
          <Text className="text-gray-600">Search...</Text>
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
              className="flex-row items-center mt-4 mb-2 "
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="ml-2 mb-4 text-gray-600">
                Back to All Orders
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-orange-500 rounded-lg p-2 mt-4"
          >
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {searchQuery && (
            <View className="pl-4 bg-gray-100">
              <TouchableOpacity
                onPress={handleResetSearch}
                className="flex-row items-center rounded-lg mb-2"
              >
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text className="ml-2 text-gray-600">Back to All Orders</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
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
          <View className="w-4/5 p-5 bg-white rounded-lg">
            <TextInput
              placeholder="Search items and places ..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="border border-gray-300 rounded-lg p-2 mb-2"
            />
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="bg-Secondary p-2 rounded-lg items-center"
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
    paddingHorizontal: 16,
  },
});

export default OrdersScreen;
