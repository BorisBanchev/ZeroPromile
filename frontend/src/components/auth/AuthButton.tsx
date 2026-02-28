import { Text, TouchableOpacity } from "react-native";

interface AuthButtonProps {
  onPressFunction: () => Promise<void>;
  isLoading: boolean;
  email?: string;
  password?: string;
  isFormValid?: boolean;
  buttonText: string;
  loadingButtonText: string;
}

export const AuthButton = ({
  onPressFunction,
  isLoading,
  email,
  password,
  isFormValid,
  buttonText,
  loadingButtonText,
}: AuthButtonProps) => {
  const isLoginButton = buttonText === "Login ->";
  return (
    <>
      {isLoginButton ? (
        <TouchableOpacity
          className="rounded-2xl py-4 items-center mb-6 bg-[#2DD4BF]"
          onPress={onPressFunction}
          disabled={isLoading || !email || !password}
          style={{ opacity: isLoading || !email || !password ? 0.5 : 1 }}
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? loadingButtonText : buttonText}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="rounded-2xl py-4 items-center mb-6 bg-[#2DD4BF]"
          onPress={onPressFunction}
          disabled={isLoading || !isFormValid}
          style={{ opacity: isLoading || !isFormValid ? 0.5 : 1 }}
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? loadingButtonText : buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};
