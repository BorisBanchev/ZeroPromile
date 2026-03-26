import { Text, View } from "react-native";
import { formatDateToDateAndTime } from "@/src/utils/formatDateToDateAndTime";
import { ActiveSession } from "@/src/types/sessions";

const ActiveSessionCard = ({
  activeSession,
}: {
  activeSession: ActiveSession;
}) => {
  return (
    <View>
      <Text className="text-white">{`Active Session:${activeSession.sessionName}`}</Text>
    </View>
  );
};

export default ActiveSessionCard;
