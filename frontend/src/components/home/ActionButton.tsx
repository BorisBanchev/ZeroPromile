import { TouchableOpacity, Text } from "react-native";

interface ActionButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary";
}

export const ActionButton = ({
  onPress,
  title,
  variant,
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      className={`rounded-2xl items-center ${
        variant === "primary"
          ? "bg-[#2DD4BF] py-3"
          : "bg-[#0A1628] border border-slate-700 py-1"
      }`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        className={`text-lg font-semibold ${
          variant === "primary" ? "text-white" : "text-gray-300"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
