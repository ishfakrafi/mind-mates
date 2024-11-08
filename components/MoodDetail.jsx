import { View, Text } from "react-native";
import { useSearchParams } from "expo-router";

export default function MoodDetails() {
  const { mood } = useSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Mood Details</Text>
      <Text>Your selected mood is: {mood}</Text>
    </View>
  );
}
