import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Redirect, router } from "expo-router";
import Swiper from "react-native-swiper";

import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../context/GlobalProvider";
const { width } = Dimensions.get("window");
import newImage from "../assets/images/IMAGE3.png";
import newImage2 from "../assets/images/IMAGE4.png";
import newImage3 from "../assets/images/IMAGE5.png";
import newImage4 from "../assets/images/IMAGE6.png";

const OnboardingScreen = () => {
  const { setUser } = useGlobalContext();

  const swiperRef = useRef(null);

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1); // Move to the next slide
    }
  };

  const onStart = () => {
    router.push("/Travlers");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem("userData");
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUser(userData);
            router.push("/Travlers");
          } catch (error) {
            console.error("Error parsing user data from AsyncStorage:", error);
            // Handle the case where the user data is not a valid JSON string
          }
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <View style={styles.container} classname="bg-gray-100">
        <Swiper
          ref={swiperRef}
          showsPagination={true}
          paginationStyle={styles.pagination}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          loop={false}
          showsButtons={false} // shows the > button to move to the next slide
        >
          {/* Slide 1 */}
          <View style={styles.slide}>
            <Image source={newImage} style={styles.logo} />
            <Text style={styles.title}>Welcome to AddisFetch!</Text>
            <Text style={styles.description}>Your world, delivered.</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.slide}>
            <Image source={newImage2} style={styles.logo} />
            <Text style={styles.title}>Shop the World, Your Way.</Text>
            <Text style={styles.description}>
              Discover a global marketplace at your fingertips.
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.slide}>
            <Image source={newImage3} style={styles.logo} />
            <Text style={styles.title}>
              {" "}
              Earn Up to 30% Back on Your Flight Cost.
            </Text>
            <Text style={styles.description}>Shop and travel with us.</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.slide}>
            <Image source={newImage4} style={styles.logo} />
            <Text style={styles.title}>Chat and Negotiate.</Text>
            <Text style={styles.description}>
              Chat with sellers to negotiate prices and arrange meetups.
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={onStart}>
              <Text style={styles.nextButtonText}>start</Text>
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
      <StatusBar style="dark" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: width * 0.7, // Adjust the logo size as needed
    height: width * 0.7,
    marginBottom: -10,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#DE6E1F", // Adjust this color if needed
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666666", // Adjust this color if needed
    textAlign: "center",
    paddingHorizontal: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 100, // Ensure this value positions the dots above the button
    alignSelf: "center",
    color: "#000000", // Adjust this color if needed
  },
  dot: {
    backgroundColor: "#ffffff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#DE6E1F",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  nextButton: {
    position: "absolute",
    bottom: 30, // Adjust this value to position the button above the bottom edge
    backgroundColor: "#DE6E1F", // Button background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextButtonText: {
    color: "#ffffff", // Button text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
