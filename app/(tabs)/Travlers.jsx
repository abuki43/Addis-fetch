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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "../../components/postCard";
import usePosts from "../../lib/fetchPosts";
import SearchModal from "../../components/SearchModal";
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
    <SafeAreaView className="flex-1 bg-gradient-to-b from-orange-50 to-gray-50 pb-16">
      <View className={isTablet ? "p-7" : "p-3 pb-0"}>
        <TouchableOpacity
          onPress={() => setSearchVisible(true)}
          className="bg-white rounded-2xl px-3 py-2 flex-row items-center justify-between shadow-lg border border-gray-100 md:p-5 md:h-16 md:w-3/4 md:mx-auto hover:scale-105 transition-all duration-300"
        >
          <View className="flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#EA9050" />
            <Text className="text-gray-400 text-base ml-3 md:text-sm">
              Search destinations & items...
            </Text>
          </View>
          <View className="bg-orange-100 p-2 rounded-full md:rounded-none md:p-0 md:bg-white">
            <Ionicons name="filter" size={18} color="#EA9050" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && !refreshing && posts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EA9050" />
          <Text className="text-gray-500 mt-4 font-medium">
            Loading travlers posts...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-red-50 p-6 rounded-2xl items-center max-w-sm w-full">
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text className="text-lg text-gray-700 text-center mt-4 mb-6">
              {error}
            </Text>
            <TouchableOpacity
              onPress={onRefresh}
              className="bg-Primary rounded-full py-3 px-8 shadow-lg active:scale-95 transform transition w-full"
            >
              <Text className="text-white font-bold text-center">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : filteredPosts.length === 0 && !loading ? (
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-orange-50 p-8 rounded-3xl items-center max-w-sm w-full">
            <Ionicons name="search" size={48} color="#EA9050" />
            <Text className="text-xl text-gray-700 font-semibold text-center mt-4">
              No Posts Found
            </Text>
            <Text className="text-gray-500 text-center mt-2 mb-6">
              Try adjusting your search
            </Text>
            {searchQuery && (
              <TouchableOpacity
                onPress={handleResetSearch}
                className="flex-row items-center justify-center mb-4"
              >
                <Ionicons name="arrow-back-circle" size={24} color="#EA9050" />
                <Text className="ml-2 text-Primary font-medium">
                  View All Posts
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onRefresh}
              className="bg-Primary rounded-full py-3 px-8 shadow-lg active:scale-95 transform transition w-full"
            >
              <Text className="text-white font-bold text-center">Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Search Results Header */}
          {searchQuery && (
            <View className="px-4 py-2 ">
              <TouchableOpacity
                onPress={handleResetSearch}
                className="flex-row items-center"
              >
                <View className="bg-orange-100 rounded-full p-2 mr-3">
                  <Ionicons name="arrow-back" size={20} color="#EA9050" />
                </View>
                <Text className="text-gray-600 font-medium">
                  Back to All Posts
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Posts List */}

          {/* Orders List */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#EA9050"
              />
            }
          >
            <MasonryList
              data={filteredPosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="px-4 py-3 md:p-3">
                  <PostCard post={item} />
                </View>
              )}
              contentContainerStyle="px-2 py-3"
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#EA9050"
                />
              }
              ListFooterComponent={
                hasMore && !loading && posts.length > 0 ? (
                  <View className="py-6">
                    <ActivityIndicator size="large" color="#EA9050" />
                  </View>
                ) : null
              }
              numColumns={column}
              initialNumToRender={10}
              windowSize={5}
            />
          </ScrollView>
        </>
      )}

      {/* Search Modal */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

export default TravlersScreen;
