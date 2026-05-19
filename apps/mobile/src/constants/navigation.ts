import { Ionicons } from "@expo/vector-icons";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export const TAB_ICONS: Record<string, [IoniconsName, IoniconsName]> = {
  //PLAYER
  Home: ["home", "home-outline"],
  Explore: ["compass", "compass-outline"],
  Favorites: ["bookmark", "bookmark-outline"],
  Notifications: ["notifications", "notifications-outline"],
  Profile: ["person", "person-outline"],
  //ORGANIZER
  Wallet: ["wallet", "wallet-outline"],
  StatsOrganizer: ["stats-chart", "stats-chart-outline"],
  Messaggi: ["chatbubbles", "chatbubbles-outline"],
};
