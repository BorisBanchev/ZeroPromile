import { View } from "react-native";
import { DrinksCounter } from "./DrinksCounter";
import { SoberStatusCard } from "./SoberStatusCard";
import { TimeToSobrietyCard } from "./TimeToSobrietyCard";
import { ActionButton } from "./ActionButton";

interface ActiveSessionSectionProps {
  isSober: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  soberTime: string;
  drinkCount: number;
  onAddDrink: () => void;
  onEndSession: () => void;
}

export const ActiveSessionSection = ({
  isSober,
  hours,
  minutes,
  seconds,
  soberTime,
  drinkCount,
  onAddDrink,
  onEndSession,
}: ActiveSessionSectionProps) => {
  return (
    <>
      {isSober ? (
        <SoberStatusCard />
      ) : (
        <View className="px-14 pb-5">
          <TimeToSobrietyCard
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            soberTime={soberTime}
          />
          <View className="mt-8">
            <DrinksCounter count={drinkCount} />
          </View>
          <View className="mt-4">
            <ActionButton
              onPress={onAddDrink}
              title="+ Add Drink"
              variant="primary"
            />
          </View>
          <View className="mt-4">
            <ActionButton
              onPress={onEndSession}
              title="End Session"
              variant="secondary"
            />
          </View>
        </View>
      )}
    </>
  );
};
