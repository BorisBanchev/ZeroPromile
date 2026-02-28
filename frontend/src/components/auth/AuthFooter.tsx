import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface AuthFooterProps {
  description: string;
  navigateText: string;
}

export const AuthFooter = ({ description, navigateText }: AuthFooterProps) => {
  const router = useRouter();

  const navigateToRegister = (): void => {
    router.push("/register");
  };

  return (
    <>
      <Text className="text-[#94A3B8]">{description} </Text>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text className="text-[#2DD4BF] font-semibold">{navigateText}</Text>
      </TouchableOpacity>
    </>
  );
};
