import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import tw from "tailwind-react-native-classnames";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[tw`${otherStyles}`]}>
      <Text style={[tw`text-base`, { color: "#D3D3D3", fontSize: 16 }]}>
        {title}
      </Text>

      <View
        style={[
          tw`w-full h-14 px-4 rounded-xl flex-row items-center`,
          {
            backgroundColor: "#FFFFFF",
            borderColor: "#CCCCCC",
            borderWidth: 1,
          },
        ]}
      >
        <TextInput
          style={[tw`flex-1  text-base`, { color: "#000000" }]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={[tw`w-6 h-6`]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
