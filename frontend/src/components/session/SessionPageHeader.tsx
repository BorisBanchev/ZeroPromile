import { Session } from "@/src/types/sessions";
import { View, Text } from "react-native";
import { formatPrettyDate } from "@/src/utils/formatDateToDayMonthDateYear";

interface SessionPageHeaderProps {
  session: Session;
}
const SessionPageHeader = ({ session }: SessionPageHeaderProps) => {
  return (
    <View className="flex-col gap-0.3">
      <View className="flex-row gap-2 ">
        <Text className="text-white font-bold text-base">
          {session?.sessionName}
        </Text>
        {session?.active && (
          <View className="mx-1 my-1 px-1 bg-[#3b989b80] rounded-full justify-center">
            <Text className="text-[10px] text-[#32e1ca] font-bold">Active</Text>
          </View>
        )}
      </View>
      <Text className="text-gray-400 text-sm">
        {formatPrettyDate(session.startedAt)}
      </Text>
    </View>
  );
};

export default SessionPageHeader;
