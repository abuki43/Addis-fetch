import React, { useState, useEffect, useCallback, useRef } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "../../components/TravelerCard";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { StyleSheet } from "react-native";

const ORDERS_BATCH_SIZE = 100;

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const OrdersScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isSearchResults, setIsSearchResults] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(
    async (startAfterDoc = null, clearExisting = false) => {
      if (!isSearchResults || clearExisting) {
        setLoading(true);
        setError(""); // Clear previous errors
        try {
          let postsQuery = query(
            collection(db, "posts"),
            where("postType", "==", "order"),
            orderBy("timestamp", "desc"),
            limit(ORDERS_BATCH_SIZE)
          );

          if (startAfterDoc) {
            postsQuery = query(postsQuery, startAfter(startAfterDoc));
          }

          const querySnapshot = await getDocs(postsQuery);
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (postsData.length < ORDERS_BATCH_SIZE) {
            setHasMore(false);
          }

          setPosts((prevPosts) =>
            clearExisting ? postsData : [...prevPosts, ...postsData]
          );
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
          console.error("Error fetching posts:", error);
          if (error.message.includes("network")) {
            setError("Network error. Please check your internet connection.");
          } else {
            setError("An error occurred while fetching posts.");
          }
        } finally {
          setLoading(false);
        }
      }
    },
    [isSearchResults]
  );

  useEffect(() => {
    if (!isSearchResults && lastVisible === null) {
      fetchPosts(null, true);
    }
  }, [fetchPosts, isSearchResults, lastVisible]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLastVisible(null);
    setHasMore(true);
    await fetchPosts(null, true);
    setRefreshing(false);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !isSearchResults) {
      fetchPosts(lastVisible);
    }
  }, [hasMore, loading, lastVisible, fetchPosts, isSearchResults]);

  const applyFilters = () => {
    const results = posts.filter((post) => {
      const description = post.description
        ? post.description.toLowerCase()
        : "";
      const category = post.category ? post.category.toLowerCase() : "";
      const fromLocation = post.fromLocation
        ? post.fromLocation.toLowerCase()
        : "";
      const toLocation = post.toLocation ? post.toLocation.toLowerCase() : "";

      const matchQuery =
        description.includes(debouncedSearchQuery.toLowerCase()) ||
        category.includes(debouncedSearchQuery.toLowerCase()) ||
        fromLocation.includes(debouncedSearchQuery.toLowerCase()) ||
        toLocation.includes(debouncedSearchQuery.toLowerCase());

      return matchQuery;
    });

    setFilteredPosts(results);
    setIsSearchResults(true);
    setSearchVisible(false);
  };

  const handleResetSearch = async () => {
    setSearchQuery("");
    setIsSearchResults(false);
    setFilteredPosts([]);
    setLastVisible(null);
    setHasMore(true);
    await fetchPosts(null, true); // Re-fetch posts for the initial view
  };

  useEffect(() => {
    if (!isSearchResults) {
      setFilteredPosts(posts);
    }
  }, [posts, isSearchResults]);

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
          {isSearchResults && (
            <TouchableOpacity
              onPress={handleResetSearch}
              className="flex-row items-center mt-4"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="ml-2 text-gray-600">Back to All Orders</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-orange-500 rounded-lg p-2 mt-4"
          >
            <Text className="text-white font-bold">Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {isSearchResults && (
            <View className="pl-4 bg-gray-100">
              <TouchableOpacity
                onPress={handleResetSearch}
                className="flex-row items-center rounded-lg"
              >
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text className="ml-2 text-gray-600">Back to All Orders</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            ref={flatListRef}
            data={filteredPosts}
            keyExtractor={(item, index) => `${index}-${item.id}`}
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
              onPress={applyFilters}
              className="bg-Secondary p-2 rounded-lg items-center"
            >
              <Text className="text-white">Apply Filters</Text>
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
