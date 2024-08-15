import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import PostCard from "../../components/TravelerCard";

const TravelersPage = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setSearchVisible(true);
  };

  const posts = [
    {
      id: "1",
      title: "iPhone 14 Pro Max",
      username: "Abebe Kebede",
      description:
        "Looking for someone to bring an iPhone 14 Pro Max from the US.",
      timestamp: "2024-08-05 12:34 PM",
      location: "Addis Ababa, Ethiopia",
      category: "Electronics",
      price: "1200",
      image:
        "https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJhbmRvbSUyMG9iamVjdHN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: "2",
      title: "Apple MacBook Pro",
      username: "Abebe Kebede",
      description:
        "Seeking a traveler to bring an Apple MacBook Pro from Dubai.",
      timestamp: "2024-08-06 09:20 AM",
      location: "Mekelle, Ethiopia",
      category: "Electronics",
      price: "2500",
      image:
        "https://th.bing.com/th/id/OIP.IiDwqwf5LR0jLQIAOX6UHgHaHa?w=176&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    {
      id: "3",
      title: "Nike Air Max Shoes",
      description:
        "Looking for someone to get Nike Air Max shoes from Nairobi.",
      timestamp: "2024-08-06 10:45 AM",
      location: "Bahir Dar, Ethiopia",
      category: "Fashion",
      price: "150",
      image:
        "https://www.bing.com/images/search?view=detailV2&ccid=Om%2bW93my&id=A4FB15A6693EB83CC4E6AE32EDEFBDAA85549BD7&thid=OIP.Om-W93myB1VEtPiMGI2nBwAAAA&mediaurl=https%3a%2f%2fcdn.mos.cms.futurecdn.net%2fA4GDK27VMnz6LtFDy9yzk.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.3a6f96f779b2075544b4f88c188da707%3frik%3d15tUhaq97%252b0yrg%26pid%3dImgRaw%26r%3d0&exph=266&expw=474&q=laptop&simid=608049696407957397&FORM=IRPRST&ck=A99FC7F8F850586252E360F704CACA49&selectedIndex=5&itb=0",
    },
    {
      id: "4",
      title: "Latest Samsung Galaxy",
      username: "Abebe Kebede",
      description:
        "Need a traveler to bring the latest Samsung Galaxy phone from South Africa.",
      timestamp: "2024-08-05 03:15 PM",
      location: "Addis Ababa, Ethiopia",
      category: "Electronics",
      price: "800",
      image:
        "https://th.bing.com/th/id/OIP.xbGJ7noLi3oQuCAYaMNKDwHaKv?w=195&h=284&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    {
      id: "5",
      title: "Travel Adapter",
      username: "Abebe Kebede",
      description: "Simple request for a universal travel adapter from Europe.",
      timestamp: "2024-08-06 01:00 PM",
      location: "Jimma, Ethiopia",
      category: "Accessories",
      price: "20",
    },
    {
      id: "6",
      title: "Books for Study",
      username: "Abebe Kebede",
      description:
        "Requesting someone to bring a set of study books from Canada.",
      timestamp: "2024-08-06 02:30 PM",
      location: "Addis Ababa, Ethiopia",
      category: "Books",
      price: "50",
      image:
        "https://th.bing.com/th/id/OIP.4dt1DNfQUavzGUxDBSfmEwHaJ4?w=195&h=260&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    {
      id: "7",
      title: "High-Quality Headphones",
      username: "Abebe Kebede",
      description:
        "Looking for high-quality noise-canceling headphones from the UK.",
      timestamp: "2024-08-05 11:10 AM",
      location: "Dire Dawa, Ethiopia",
      category: "Electronics",
      price: "300",
      image:
        "https://th.bing.com/th/id/OIP.4j2jaB8Xsfs0gXiiVLsBKAHaHM?w=169&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
  ];

  const handleFilterSubmit = () => {
    // Handle filter submission logic
    setSearchVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={handleSearch}
          style={styles.searchInputContainer}
        >
          <Text style={styles.searchPlaceholder}>Search...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </ScrollView>

      <Modal
        visible={searchVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchModalInput}
            />
            <TouchableOpacity
              onPress={handleFilterSubmit}
              style={styles.filterButton}
            >
              <Text style={styles.filterButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSearchVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  searchModalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: "100%",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default TravelersPage;
