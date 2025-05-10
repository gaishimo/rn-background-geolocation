import firestore from "@react-native-firebase/firestore";
import { Location } from "react-native-background-geolocation";

export const dbOperations = { addLocation };

const userId = "user1";

async function addLocation(location: Location) {
  await firestore().collection("locations").add({
    userId,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: new Date(),
  });
}
