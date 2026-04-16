import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useSessions } from "@/src/hooks/useSessions";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Notification } from "@/src/components/ui/Notification";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { formatPrettyDate } from "@/src/utils/formatDateToDayMonthDateYear";

export default function SessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { sessions } = useSessions();

  const session = sessions?.find((session) => session.sessionId === id);

  if (!session) return;

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <Notification />
      <ScrollView className="px-4 py-">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 mb-3 "
        >
          <AntDesign name="arrow-left" size={12} color="grey" />
          <Text className="text-gray-400">Back</Text>
        </TouchableOpacity>
        <View className="flex-col gap-0.3">
          <View className="flex-row gap-2 ">
            <Text className="text-white font-bold text-base">
              {session?.sessionName}
            </Text>
            {session?.active && (
              <View className="mx-1 my-1 px-1 bg-[#3b989b80] rounded-full justify-center">
                <Text className="text-[10px] text-[#32e1ca] font-bold">
                  Active
                </Text>
              </View>
            )}
          </View>
          <Text className="text-gray-400 text-sm">
            {formatPrettyDate(session.startedAt)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
