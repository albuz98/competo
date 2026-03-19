import { AuthProvider } from './src/context/AuthContext';
import { NotificationsProvider } from './src/context/NotificationsContext';
import { TeamsProvider } from './src/context/TeamsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <TeamsProvider>
        <NotificationsProvider>
          <FavoritesProvider>
            <AppNavigator />
          </FavoritesProvider>
        </NotificationsProvider>
      </TeamsProvider>
    </AuthProvider>
  );
}
