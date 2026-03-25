# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Competo — Project Guide

## Repository structure

```
competo/
├── apps/
│   ├── mobile/          # React Native / Expo app (primary codebase)
│   └── web/             # React + Vite web app (minimal, WIP)
└── package.json         # Root workspace
```

All active development happens in `apps/mobile/`.

---

## Mobile app (`apps/mobile/`)

**Stack**: React Native 0.81 · Expo SDK 54 · TypeScript 5.9 · React 19

### Running

```bash
cd apps/mobile
expo start          # interactive menu
expo start --ios    # iOS simulator
expo start --android
```

### Key dependencies

| Package                          | Purpose                 |
| -------------------------------- | ----------------------- |
| `@react-navigation/native-stack` | Stack navigation        |
| `@react-navigation/bottom-tabs`  | Tab bar                 |
| `expo-linear-gradient`           | Orange gradient headers |
| `expo-notifications`             | Push notifications      |
| `expo-image-picker`              | Avatar selection        |
| `expo-location`                  | User geolocation        |
| `react-native-safe-area-context` | Safe area insets        |
| `@faker-js/faker`                | Mock data generation    |

---

## Source layout (`src/`)

```
src/
├── types/index.ts          # All TypeScript types and RootStackParamList
├── mock/data.ts            # Faker-based mock generators (tournaments, teams, users)
├── api/
│   ├── config.ts           # isMocking flag, apiFetch helper
│   ├── auth.ts             # Login, register, fetchProfile, updateProfile, registerPushToken
│   ├── tournaments.ts      # Tournaments CRUD + MyTournament cache + fetchNearbyTournaments
│   ├── teams.ts            # Teams CRUD + mock cache
│   └── favorites.ts        # Favorites CRUD (fetchFavorites, addFavorite, removeFavorite)
├── context/
│   ├── AuthContext.tsx     # User session, login/logout, updateProfile
│   ├── TeamsContext.tsx    # Teams list, create/addMember/removeMember
│   ├── NotificationsContext.tsx  # In-app notification list + addNotification
│   └── FavoritesContext.tsx      # Tournament bookmarks — loads from API on login, persists on add/remove
├── hooks/
│   ├── useNotificationSetup.ts      # No-op on non-iOS
│   └── useNotificationSetup.ios.ts  # iOS notification setup
├── navigation/
│   ├── AppNavigator.tsx    # Root stack navigator
│   ├── MainTabNavigator.tsx # Bottom tabs (Home/Esplora/Preferiti/Profilo)
│   └── navigationRef.ts    # Global navigation ref for use outside components
├── styles/                 # One *.styles.ts per screen/navigator (see Styling conventions)
└── screens/
    ├── HomeScreen.tsx              # Feed: I Tuoi Tornei + Esplora + map
    ├── EsploraScreen.tsx           # Tournament discovery
    ├── PreferitiScreen.tsx         # Bookmarked tournaments
    ├── ProfiloScreen.tsx           # User profile + teams section
    ├── TournamentDetailScreen.tsx  # Tournament info + sign-up CTA
    ├── MyTournamentDetailScreen.tsx # Bracket/groups live viewer (registered)
    ├── TeamSelectScreen.tsx        # Team picker modal (before payment)
    ├── PaymentScreen.tsx           # Card payment form
    ├── TeamsScreen.tsx             # Full teams list
    ├── CreateTeamScreen.tsx        # Create new team form
    ├── TeamDetailScreen.tsx        # Team detail + member management
    ├── InvitePlayersScreen.tsx     # Search users / share invite link
    ├── EditProfileScreen.tsx       # Edit name, email, etc.
    ├── LoginScreen.tsx
    ├── RegisterScreen.tsx
    ├── OnboardingScreen.tsx
    ├── ForgotPasswordScreen.tsx
    └── NotificheScreen.tsx
```

---

## Provider hierarchy (`App.tsx`)

```tsx
<AuthProvider>
  <TeamsProvider>
    <NotificationsProvider>
      <FavoritesProvider>
        <AppNavigator />
      </FavoritesProvider>
    </NotificationsProvider>
  </TeamsProvider>
</AuthProvider>
```

---

## Navigation

### Stack routes (`RootStackParamList`)

| Route                | Screen                   | Notes                                                                |
| -------------------- | ------------------------ | -------------------------------------------------------------------- |
| `MainTabs`           | MainTabNavigator         | Initial route                                                        |
| `Login`              | LoginScreen              |                                                                      |
| `Register`           | RegisterScreen           |                                                                      |
| `Onboarding`         | OnboardingScreen         |                                                                      |
| `TournamentDetail`   | TournamentDetailScreen   | `tournamentId`, `justRegistered?`                                    |
| `MyTournamentDetail` | MyTournamentDetailScreen | `tournamentId`                                                       |
| `TeamSelect`         | TeamSelectScreen         | Modal; `tournamentId`, `entryFee`, `tournamentName`                  |
| `Payment`            | PaymentScreen            | `tournamentId`, `entryFee`, `tournamentName`, `teamId?`, `teamName?` |
| `Teams`              | TeamsScreen              |                                                                      |
| `CreateTeam`         | CreateTeamScreen         |                                                                      |
| `TeamDetail`         | TeamDetailScreen         | `teamId`                                                             |
| `InvitePlayers`      | InvitePlayersScreen      | `teamId`                                                             |
| `EditProfile`        | EditProfileScreen        |                                                                      |
| `Notifiche`          | NotificheScreen          |                                                                      |
| `ForgotPassword`     | ForgotPasswordScreen     |                                                                      |

### Bottom tabs (`MainTabParamList`)

`Home` · `Esplora` · `Preferiti` · `Profilo`

---

## Mock / API mode

Controlled by `app.config.js` via `expo-constants`. Set `MOCKING=false` env var to hit the real API:

```bash
MOCKING=false expo start  # use real API
```

```ts
// src/api/config.ts
export const isMocking: boolean = Constants.expoConfig?.extra?.mocking ?? true;
```

When `isMocking = true` (default), all API functions return faker-generated data from in-memory caches. Real API base URL: `https://api.competo.example.com`.

### Complete API surface

| Function                 | Method + Endpoint                           | File           |
| ------------------------ | ------------------------------------------- | -------------- |
| `login`                  | POST `/auth/login`                          | auth.ts        |
| `register`               | POST `/auth/register`                       | auth.ts        |
| `forgotPassword`         | POST `/auth/forgot-password`                | auth.ts        |
| `fetchProfile`           | GET `/auth/profile`                         | auth.ts        |
| `updateProfile`          | PATCH `/auth/profile`                       | auth.ts        |
| `registerPushToken`      | POST `/auth/push-token`                     | auth.ts        |
| `fetchTournaments`       | GET `/tournaments`                          | tournaments.ts |
| `fetchTournament`        | GET `/tournaments/{id}`                     | tournaments.ts |
| `fetchNearbyTournaments` | GET `/tournaments/nearby?lat=&lng=&radius=` | tournaments.ts |
| `signUpForTournament`    | POST `/tournaments/{id}/signup`             | tournaments.ts |
| `fetchMyTournaments`     | GET `/my-tournaments`                       | tournaments.ts |
| `fetchMyTournament`      | GET `/my-tournaments/{id}`                  | tournaments.ts |
| `activateTournament`     | POST `/my-tournaments/{id}/activate`        | tournaments.ts |
| `fetchFavorites`         | GET `/favorites`                            | favorites.ts   |
| `addFavorite`            | POST `/favorites/{id}`                      | favorites.ts   |
| `removeFavorite`         | DELETE `/favorites/{id}`                    | favorites.ts   |
| `fetchUserTeams`         | GET `/teams/mine`                           | teams.ts       |
| `createTeam`             | POST `/teams`                               | teams.ts       |
| `inviteMember`           | POST `/teams/{id}/invite`                   | teams.ts       |
| `removeMember`           | DELETE `/teams/{id}/members/{memberId}`     | teams.ts       |
| `updateMemberRole`       | PATCH `/teams/{id}/members/{memberId}/role` | teams.ts       |
| `getPendingInvites`      | GET `/teams/invites/pending`                | teams.ts       |
| `getSentInvites`         | GET `/teams/{id}/invites`                   | teams.ts       |
| `acceptInvite`           | POST `/teams/invites/{id}/accept`           | teams.ts       |
| `rejectInvite`           | POST `/teams/invites/{id}/reject`           | teams.ts       |
| `searchUsers`            | GET `/users/search?q=`                      | teams.ts       |

### Mock cache pattern

Each API module keeps module-level cache variables (e.g. `mockTeamCache`, `mockUsersCache`, `pendingInviteCache`). Always return shallow copies from fetch functions — never the cache reference directly — to prevent React state from aliasing the mutable cache:

```ts
return [...getMockTeamCache()]; // ✓ shallow copy
return getMockTeamCache(); // ✗ aliasing
```

`api/teams.ts` seeds a pre-populated pending invite ("Marco Bianchi / Milano United") so the invite-acceptance flow is testable out-of-the-box.

### Shared tournament cache

`src/api/tournaments.ts` exports `getMyTournamentsCache()` so `HomeScreen` and `MyTournamentDetailScreen` share the same `MyTournament[]` instances (consistent IDs across navigation).

---

## Styling conventions

- **Brand orange**: `#E8601A` (primary) · `#F5A020` (gradient end)
- **Gradient headers**: `<LinearGradient colors={["#E8601A", "#F5A020"]}>`
- **Background**: `#f8fafc`
- **Text hierarchy**: `#1e293b` (primary) · `#64748b` (secondary) · `#94a3b8` (muted)
- **Danger**: `#ef4444`
- **Success**: `#10b981`
- All `StyleSheet.create` blocks live in `src/styles/<ScreenName>.styles.ts` — never inline in screen files. Each style file uses a named export that matches the original variable (e.g. `export const tds`, `export const s`, `export const bStyles`). Dimension/layout constants used in both the stylesheet and JSX (e.g. `BIG_W`, `CARD_WIDTH`, bracket constants) are also exported from the style file.
- `MyTournamentDetailScreen.styles.ts` and `OrganizerTournamentDetailScreen.styles.ts` export shared bracket layout constants: `CARD_H`, `CARD_W`, `COL_GAP`, `SLOT_H`, `LABEL_H`, `LINE_W`, `LINE_COLOR`.

---

## Key features

### Tournament bracket viewer (`MyTournamentDetailScreen`)

- **Groups** (`kind: 'groups'`): tab bar with Gironi + Classifica tabs; live score simulation via `setInterval` every 5s
- **Knockout** (`kind: 'knockout'`): Sofascore-style bracket with absolute-positioned connector lines between rounds; `BracketMatchCard` with orange left border for live matches
- Live simulation: `simulateLiveUpdate()` pure function, 40% chance of scoring per tick

### Team management

- `TeamsContext` provides: `createTeam`, `addMember`, `removeMember`, `getTeamById`, `refreshTeams`, `acceptInvite`, `rejectInvite`, `updateMemberRole`, plus state `pendingReceivedInvites` and `sentPendingInvites`
- **Role-based**: only `representative` can invite or remove members; enforced in both `TeamDetailScreen` and `InvitePlayersScreen`
- **Roles**: `TeamRole = 'representative' | 'calciatore' | 'allenatore' | 'portiere'`. Max 1 `allenatore` and 1 `portiere` per team; `representative` role is immutable
- **Pending invites**: `inviteMember` creates a `PendingInvite` rather than directly adding to `team.members`. Members appear in the roster only after calling `acceptInvite`
- **Invite notifications**: fired at the screen level (`InvitePlayersScreen`) because `TeamsContext` wraps `NotificationsProvider` and cannot call `useNotifications` directly
- Duplicate team name check: same representative cannot create two teams with the same name (validated in `api/teams.ts → createTeam`)

### Favorites

- `FavoritesContext` provides: `favorites`, `addFavorite`, `removeFavorite`, `isFavorite`
- Loads favorites via `api/favorites.ts → fetchFavorites` on user login (resets to `[]` on logout)
- `addFavorite`/`removeFavorite` update state immediately then fire API call in the background (fire-and-forget `.catch(() => {})`)
- In mock mode `api/favorites.ts` keeps a module-level array as the backing store
- Bookmark button in `TournamentDetailScreen` header; `PreferitiScreen` lists bookmarks with navigation to detail
- Auto-removed from favorites when a tournament is registered (in the `justRegistered` useEffect)

### Map interaction (`EsploraScreen`)

- Tapping a marker sets `selectedTournament` state → shows a bottom card overlay
- **Do not use `<Callout>`** — it is unreliable on Android with custom views. Use marker `onPress` + a positioned `View` overlay instead

### Push notification routing (`useNotificationSetup.ios.ts`)

- On mount: requests permission, then calls `getExpoPushTokenAsync()` + `registerPushToken(token, userToken)` to register with the backend (no-op in mock mode)
- Foreground/background taps: `addNotificationResponseReceivedListener`
- Cold-start (app killed): `getLastNotificationResponseAsync()` on mount
- Both paths use `navigateWhenReady()` which retries until `navigationRef.isReady()`
- Invite notification payload: `{ screen: 'Teams' }` → navigates to `TeamsScreen` (shows "INVITI IN SOSPESO")
- Tournament notification payload: `{ tournamentId }` → navigates to `TournamentDetail`

### Genera torneo gate (`MyTournamentDetailScreen`)

- `MyTournament` has `isOrganizer?: boolean` and `isGenerated?: boolean`
- When `isGenerated === false`: bracket/groups are hidden; organizer sees a "Genera torneo" button
- `activateTournament()` in `api/tournaments.ts` sets `isGenerated = true` on the cache entry
- Live score simulation (`setInterval`) only starts when `isGenerated !== false`
- Mock assignment: index 0 = organizer + ungenerated, index 1 = ungenerated (non-organizer), index 2+ = generated

### Tournament sign-up flow

`TournamentDetail` → `TeamSelect` (modal, must pick a team) → `Payment` → `TournamentDetail` (justRegistered)

---

## TypeScript

```bash
cd apps/mobile
npx tsc --noEmit
```

**Known pre-existing error** (not introduced by this project's code):

- `src/hooks/useNotificationSetup.ios.ts`: `TS2322` — newer `expo-notifications` SDK requires `shouldShowBanner` and `shouldShowList` on `NotificationBehavior`. This is an upstream type mismatch; ignore it.
