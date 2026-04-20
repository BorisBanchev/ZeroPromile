import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { formatDateForSessionsData } from "@/src/utils/formatDateToDateAndTime";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@/src/types/sessions";

const SessionCard = ({ session }: { session: Session }) => {
  const router = useRouter();

  if (!session) {
    return;
  }
  const handleNavigateToSession = (session: Session) => {
    router.navigate({
      pathname: "/session/[id]",
      params: { id: session.sessionId },
    });
  };
  const dateAndTimeStrings = formatDateForSessionsData(
    new Date(session.startedAt),
  );

  return (
    <View className="gap-2">
      <TouchableOpacity
        onPress={() => handleNavigateToSession(session)}
        className="mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3"
      >
        <View className="flex-col gap-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-white text-semibold text-sm">
              {session.sessionName}
            </Text>
            {session.active && (
              <View className="mx-1 my-1 px-1 bg-[#3b989b80] rounded-full justify-center">
                <Text className="text-[10px] text-[#32e1ca] font-bold">
                  Active
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center">
            <Text className="text-slate-400 text-xs flex-1">
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
      </TouchableOpacity>
    </View>
  );
};

export default SessionCard;
