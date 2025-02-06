import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchModal = ({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  onApplyFilters,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 justify-end bg-black/70">
        <View className="bg-white rounded-t-3xl p-6 h-3/4 md:h-2/3">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">Search</Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 p-1 rounded-full"
            >
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="mb-6">
            <Text className="text-gray-600 text-sm mb-2 font-medium">
              Find items & places
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
              <Ionicons name="search" size={22} color="#EA9050" />
              <TextInput
                placeholder="Search items and destinations"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 py-2 px-3 text-base text-gray-700"
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Popular Searches */}
          <View className="mb-8">
            <Text className="text-gray-600 text-sm mb-3 font-medium">
              Popular searches
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity className="bg-orange-50 px-4 py-2 rounded-full">
                <Text className="text-Primary font-medium">Electronics</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-orange-50 px-4 py-2 rounded-full">
                <Text className="text-Primary font-medium">Clothes</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-orange-50 px-4 py-2 rounded-full">
                <Text className="text-Primary font-medium">Dubai Laptop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-auto">
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                onPress={onApplyFilters}
                className="flex-1 bg-Primary rounded-full py-2 mb-3 shadow-lg active:scale-95"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="search" size={20} color="white" />
                  <Text className="text-white text-center font-bold text-lg ml-2">
                    Search Now
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-100 rounded-full py-2 mb-3"
              >
                <Text className="text-gray-600 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;
