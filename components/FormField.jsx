import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  multiline,
  numberOfLines,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getInputHeight = () => {
    if (multiline && numberOfLines) {
      return numberOfLines * 20;
    }
    return 54; 
  };

  return (
    <View className={`mb-6 ${otherStyles}`}>
      <Text className="text-base font-semibold text-gray-700 mb-2">{title}</Text>
      <View
        className={`w-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm ${
          multiline ? "p-4" : "px-4"
        }`}
        style={{ minHeight: getInputHeight() }}
      >
        <TextInput
          className={`flex-1 text-base text-gray-700 ${
            multiline ? "text-left" : ""
          }`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={handleChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4"
          >
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;