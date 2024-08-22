import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, IconButton } from "../components";
import { icons } from "../constants";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-[500px] h-[100px]"
            resizeMode="contain"
          />
          <Text style={{ color: "#FFFFFF" }}>
            Your Journey To Wellness Starts Here
          </Text>
          <View className="relative mt-5">
            <CustomButton
              title="Login with Email"
              handlePress={() => router.push("/sign-in")}
              width={350}
              containerStyles={{ marginTop: 16 }}
            />
          </View>
          <View className="relative mt-5">
            <IconButton
              title="Login with Google"
              handlePress={() => router.push("/sign-in")}
              icon={icons.google}
              width={350}
              containerStyles={{ marginTop: 16 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
