import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function App(){
  return (
    <SafeAreaView className = "bg-primary h-full">
      <ScrollView contentContainerStyle = {{ height: '100%'}}>
        <View className="w-full justify-center items-center h-full px-4">
        <Image source={require('../../assets/images/icon.png')} 
        className = "w-[200px] h-[200px]" resizeMode="contain"/>

        <View className="relative mt-5">
          <Text className="text-3xl text-white font-bold text-center">MindMates</Text>
        </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}


