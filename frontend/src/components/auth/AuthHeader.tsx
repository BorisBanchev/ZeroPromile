import { View, Text } from "react-native";

interface AuthHeaderProps {
  LogoText: string;
  headerBluish?: string[];
  header?: string;
  subheader: string;
}

export const AuthHeader = ({
  LogoText,
  headerBluish,
  header,
  subheader,
}: AuthHeaderProps) => {
  const isLoginHeader = headerBluish !== null;
  return (
    <>
      {isLoginHeader && headerBluish ? (
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-[#2DD4BF] rounded-3xl items-center justify-center mb-5">
            <Text className="text-white text-4xl font-bold">{LogoText}</Text>
          </View>
          <Text className="text-white text-4xl font-bold mb-2">
            {headerBluish[0]}
            <Text className="text-[#2DD4BF]">{headerBluish[1]}</Text>
          </Text>
          <Text className="text-[#94A3B8] text-base">{subheader}</Text>
        </View>
      ) : (
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-[#2DD4BF] rounded-3xl items-center justify-center mb-5">
            <Text className="text-white text-4xl font-bold">{LogoText}</Text>
          </View>
          <Text className="text-white text-4xl font-bold mb-2">{header}</Text>
          <Text className="text-[#94A3B8] text-base">{subheader}</Text>
        </View>
      )}
    </>
  );
};
