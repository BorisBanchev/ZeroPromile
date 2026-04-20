import { View } from "react-native";
import SessionStatsBox from "./SessionStatsBox";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Session } from "@/src/types/sessions";
import { formatSessionDuration } from "@/src/utils/formatSessionDuration";

interface SessionStatsSectionProps {
  session: Session;
  sessionTotalAlcoholGrams: string;
}

const SessionStatsSection = ({
  session,
  sessionTotalAlcoholGrams,
}: SessionStatsSectionProps) => {
  return (
    <View className="flex-row flex-wrap justify-between my-4">
      <SessionStatsBox
        label={"Peak BAC"}
        value={`${session.peakBac.toFixed(2)}‰`}
        icon={<Ionicons name={"trending-up-outline"} size={14} color="grey" />}
        valueColor={session.peakBac > 0 ? "#fa6171" : "#32e1ca"}
      />
      <SessionStatsBox
        label={"Total Drinks"}
        value={session.totalDrinks}
        icon={
          <MaterialCommunityIcons
            name="glass-cocktail"
            color="grey"
            size={14}
          />
        }
      />
      <SessionStatsBox
        label={"Duration"}
        value={formatSessionDuration(session.startedAt, session.endedAt)}
        icon={<Ionicons name={"time-outline"} size={14} color="grey" />}
      />
      <SessionStatsBox
        label={"Total Alcohol"}
        value={sessionTotalAlcoholGrams}
        icon={<MaterialIcons name="water-drop" size={14} color="gray" />}
      />
    </View>
  );
};

export default SessionStatsSection;
