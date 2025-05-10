import { startGeofenceLoop } from "@/libs/geolocation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Text, View } from "react-native";
import BackgroundGeolocation, {
  Subscription,
} from "react-native-background-geolocation";

export default function HomeScreen() {
  const [location, setLocation] = useState("");

  const subscriptions = useRef<Subscription[]>([]);

  // 位置情報の更新に基づいて発火
  const prepareGeoLocation = useCallback(async () => {
    subscriptions.current.push(
      BackgroundGeolocation.onLocation((location) => {
        console.log("[onLocation]", location);
        setLocation(JSON.stringify(location, null, 2));
      })
    );

    // モーション: move, stop
    subscriptions.current.push(
      BackgroundGeolocation.onMotionChange((event) => {
        // console.log("[onMotionChange]", event);
      })
    );

    // モーション: 活動の変化: still, on_foot, in_vehicle, on_bicycle, running
    subscriptions.current.push(
      BackgroundGeolocation.onActivityChange((event) => {
        // console.log("[onActivityChange]", event);
      })
    );

    // 位置情報の許可情報の変化・GPS、ネットワーク位置情報プロバイダ、位置情報精度の変化等
    subscriptions.current.push(
      BackgroundGeolocation.onProviderChange((event) => {
        // console.log("[onProviderChange]", event);
      })
    );

    const state = await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopTimeout: 5,
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_DEBUG,
      stopOnTerminate: false,
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
    });
    console.log(
      "- BackgroundGeolocation is configured and ready: ",
      state.enabled
    );
    startGeofenceLoop();
  }, []);

  useEffect(() => {
    prepareGeoLocation();

    return () => {
      subscriptions.current.forEach((subscription) => {
        subscription.remove();
      });
    };
  }, [prepareGeoLocation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row" }}>
        <Button
          title="ログをクリア"
          onPress={useCallback(async () => {
            await BackgroundGeolocation.logger.destroyLog();
          }, [])}
        />
        <Button
          title="ログをメールで送信"
          onPress={useCallback(async () => {
            const log = await BackgroundGeolocation.logger.emailLog(
              "example@gmail.com"
            );
            console.log(log);
          }, [])}
        />
      </View>

      <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{location}</Text>
    </View>
  );
}
