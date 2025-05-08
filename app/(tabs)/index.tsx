import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Switch, Text, View } from "react-native";
import BackgroundGeolocation, {
  Subscription,
} from "react-native-background-geolocation";

export default function HomeScreen() {
  const [enabled, setEnabled] = useState(false);
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
        console.log("[onMotionChange]", event);
      })
    );

    // モーション: 活動の変化: still, on_foot, in_vehicle, on_bicycle, running
    subscriptions.current.push(
      BackgroundGeolocation.onActivityChange((event) => {
        console.log("[onActivityChange]", event);
      })
    );

    // 位置情報の許可情報の変化・GPS、ネットワーク位置情報プロバイダ、位置情報精度の変化等
    subscriptions.current.push(
      BackgroundGeolocation.onProviderChange((event) => {
        console.log("[onProviderChange]", event);
      })
    );

    const state = await BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_DEBUG,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      // url: "http://yourserver.com/locations",
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {
        // <-- Optional HTTP headers
        "X-FOO": "bar",
      },
      params: {
        // <-- Optional HTTP params
        auth_token: "maybe_your_server_authenticates_via_token_YES?",
      },
    });
    setEnabled(state.enabled);
    console.log(
      "- BackgroundGeolocation is configured and ready: ",
      state.enabled
    );
  }, []);

  const start = useCallback(async () => {
    try {
      await BackgroundGeolocation.start();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await BackgroundGeolocation.stop();
      setLocation("");
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    prepareGeoLocation();

    return () => {
      subscriptions.current.forEach((subscription) => {
        subscription.remove();
      });
    };
  }, [prepareGeoLocation]);

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
  }, [enabled, start, stop]);

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

      <Text style={{ marginBottom: 16 }}>
        Click to enable BackgroundGeolocation
      </Text>
      <Switch value={enabled} onValueChange={setEnabled} />
      <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{location}</Text>
    </View>
  );
}
