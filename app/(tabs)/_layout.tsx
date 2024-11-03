import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { AppearanceProvider } from "../AppearanceContext";

export default function TabsLayout() {
  // State to control the modal visibility
  const [isModalVisible, setModalVisible] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const initiateCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <>
      {/* <AppearanceProvider> */}
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#c6c6cc",
          tabBarStyle: {
            backgroundColor: "#AB79FD",
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={30} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass-outline" color={color} size={30} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" color={color} size={30} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={30} />
            ),
          }}
        />
      </Tabs>
      {/* </AppearanceProvider> */}

      {/* Floating SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={toggleModal}>
        <Ionicons name="alert-circle" size={32} color="white" />
        <Text style={tw`text-white font-semibold`}>SOS</Text>
      </TouchableOpacity>

      {/* Modal for SOS */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={tw`font-bold text-2xl text-center mb-4`}>
              Help is a click away!
            </Text>

            <TouchableOpacity
              onPress={() => initiateCall("000")}
              style={tw`flex-row justify-between items-center mb-4`}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`font-semibold text-black text-xl`}>
                  Emergency Services:
                </Text>
                <Text style={tw`font-semibold text-blue-600 text-xl`}>000</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => initiateCall("1300224636")}
              style={tw`flex-row justify-between items-center mb-4`}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`font-semibold text-black text-xl`}>
                  Suicide Help Service (Lifeline):{" "}
                </Text>
                <Text style={tw`font-semibold text-blue-600 text-xl`}>
                  13 11 14
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => initiateCall("1300224636")}
              style={tw`flex-row justify-between items-center mb-4`}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`font-semibold text-black text-xl`}>
                  Depression/Anxiety (Beyond Blue):
                </Text>
                <Text style={tw`font-semibold text-blue-600 text-xl`}>
                  1300 22 4636
                </Text>
              </View>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={tw`bg-gray-200 p-3 mt-8 rounded-lg`}
              onPress={toggleModal}
            >
              <Text style={tw`text-center font-bold text-gray-700`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sosButton: {
    backgroundColor: "red",
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute", // Make the button float
    bottom: 90, // Adjust based on your tab height
    right: 20, // Adjust the position
    zIndex: 10, // Make sure it floats above other elements
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 80,
    paddingTop: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    width: "100%",
  },
});
