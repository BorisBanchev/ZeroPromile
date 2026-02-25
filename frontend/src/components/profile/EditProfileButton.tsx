import { TouchableOpacity, Text } from "react-native";

interface EditProfileButtonProps {
  onPress: () => void;
}

export const EditProfileButton = ({ onPress }: EditProfileButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-[#4B5563] py-4 items-center m-4 rounded-xl"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className="text-[16px] font-semibold text-white">Edit Profile</Text>
    </TouchableOpacity>
  );
};
