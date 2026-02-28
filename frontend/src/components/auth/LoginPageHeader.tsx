import { View, Text } from "react-native";

interface LoginPageHeaderProps {
  LogoText: string;
  header: string[];
  subheader: string;
}

export const LoginPageHeader = ({
  LogoText,
  header,
  subheader,
}: LoginPageHeaderProps) => {
  const whiteHeader = header[0];
  const bluishHeader = header[1];
  return (
    <View className="items-center mb-12">
      <View className="w-24 h-24 bg-[#2DD4BF] rounded-3xl items-center justify-center mb-5">
        <Text className="text-white text-4xl font-bold">{LogoText}</Text>
      </View>
      <Text className="text-white text-4xl font-bold mb-2">
        {whiteHeader}
        <Text className="text-[#2DD4BF]">{bluishHeader}</Text>
      </Text>
      <Text className="text-[#94A3B8] text-base">{subheader}</Text>
    </View>
  );
};
