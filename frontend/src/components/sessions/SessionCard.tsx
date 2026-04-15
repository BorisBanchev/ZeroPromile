import { Text, View } from "react-native";
import { formatDateForSessionsData } from "@/src/utils/formatDateToDateAndTime";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@/src/types/sessions";

const SessionCard = ({
  session,
  active,
}: {
  session: Session;
  active: boolean;
}) => {
  if (!session) {
    return;
  }

  const dateAndTimeStrings = formatDateForSessionsData(
    new Date(session.startedAt),
  );
  return (
    <View className="gap-2">
      <View className="mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3">
        <View className="flex-col gap-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-white text-semibold text-sm">
              {session.sessionName}
            </Text>
            {session.active && (
              <View className="px-2 py-0.5 bg-[#3b989b80] rounded-full">
                <Text className="text-xs text-[#32e1ca] font-bold">Active</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-400 text-xs">
              {dateAndTimeStrings.dateString}
            </Text>
            <Text className="text-slate-400">{">"}</Text>
          </View>
          <View className="flex-row items-center gap-6">
            <View className="flex-row items-center gap-1">
              <Ionicons name={"time-outline"} size={14} color="grey" />
              <Text className="text-slate-300 text-xs">
                {dateAndTimeStrings.timeString}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name={"wine-outline"} size={14} color="grey" />
              <Text className="text-slate-300 text-xs">
                {session.totalDrinks} drinks
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name={"trending-up-outline"} size={14} color="grey" />
              <Text
                style={
                  session.peakBac > 0
                    ? { color: "#fa6171" }
                    : { color: "#32e1ca" }
                }
                className="text-xs"
              >
                Peak: {session.peakBac.toFixed(2)}‰
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SessionCard;
