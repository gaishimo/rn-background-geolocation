import BackgroundGeolocation from "react-native-background-geolocation";

/**
 * アプリがForegroundのときに呼び出す想定
 */
export async function startGeofenceLoop() {
  console.log("startGeofenceLoop()");
  await setupGeofenceListeners();
  await updateGeofenceAndSendLocation();
}

function setupGeofenceListeners() {
  BackgroundGeolocation.onGeofence(async (geofence) => {
    console.log("[geofence]", geofence.identifier, geofence.action);

    if (geofence.action === "EXIT") {
      try {
        await updateGeofenceAndSendLocation();
      } catch (e) {
        console.error(e);
      }
    }
  });
}

export async function updateGeofenceAndSendLocation() {
  const location = await BackgroundGeolocation.getCurrentPosition({
    samples: 1,
    persist: true,
  });

  console.log("location:", location);

  BackgroundGeolocation.removeGeofences();

  // ユーザーの現在位置を中心に新しいジオフェンスを設定
  const geofenceId = `geofence_${new Date().getTime()}`;

  await BackgroundGeolocation.addGeofence({
    identifier: geofenceId,
    radius: 200,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    notifyOnEntry: false,
    notifyOnExit: true,
  });

  await BackgroundGeolocation.startGeofences();

  // 位置情報をサーバーに送信（必要に応じて）
}
