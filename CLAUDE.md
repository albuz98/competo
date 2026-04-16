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

# From repo root (workspace scripts):
npm run mobile      # same as expo start in apps/mobile
npm run web         # starts the web app (apps/web)
```

### Key dependencies

| Package                          | Purpose                        |
| -------------------------------- | ------------------------------ |
| `@react-navigation/native-stack` | Stack navigation               |
| `@react-navigation/bottom-tabs`  | Tab bar                        |
| `expo-linear-gradient`           | Orange gradient headers        |
| `expo-notifications`             | Push notifications             |
| `expo-image-picker`              | Avatar selection               |
| `expo-location`                  | User geolocation               |
| `expo-secure-store`              | Persistent auth token storage  |
| `react-native-maps`              | Map in Esplora screen          |
| `react-native-safe-area-context` | Safe area insets               |
| `@expo/vector-icons`             | Ionicons used in tab bar icons |
| `@faker-js/faker`                | Mock data generation           |

---

## Source layout (`src/`)

```
src/
├── types/
│   ├── index.ts            # Re-exports; RootStackParamList lives here
│   ├── user.ts             # User, UserProfile discriminated union, PlayerProfile, OrganizerProfile
│   ├── auth.ts             # LoginCredentials, RegisterCredentials, UpdateProfileData
│   ├── team.ts             # Team, TeamMember, PendingInvite, AppUser, TeamRole
│   ├── tournament.ts       # Tournament, MyTournament, TournamentRegisteredTeam, TeamRegistrationStatus
│   ├── organizer.ts        # OrganizerOnboardingData, EntityType, LegalForm
│   └── components.ts       # Shared component prop types
├── constants/
│   ├── user.ts             # UserRole enum (PLAYER | ORGANIZER)
│   ├── tournament.ts       # PHASES, SINGLE_FORMATS, KO_FORMATS, STEP_TITLES_TOURNAMENT, GAMES, SPORT_EMOJI
│   └── organizer.ts        # STEP_TITLES_ORGANIZER, ENTITY_TYPES, LEGAL_FORMS (with labels/icons)
├── theme/
│   ├── colors.ts           # Brand color constants (import instead of hardcoding hex)
│   └── dimension.ts        # sizesEnum (small/medium/big), button/text padding presets, CARD_GRADIENTS
├── lib/
│   ├── queryClient.ts      # TanStack Query client (staleTime: 2 min, retry: 2, refetchOnWindowFocus: false)
│   └── queryKeys.ts        # Centralized query key factory — always use these, never inline key strings
├── utils/
│   └── tournamentGenerator.ts  # Pure functions: generateSchedule(), computeStandings(), GeneratorConfig/Output types
├── mock/data.ts            # Faker-based mock generators (tournaments, teams, users)
├── api/
│   ├── config.ts           # isMocking flag, apiFetch helper
│   ├── mockFlags.ts        # Per-endpoint mock overrides (IS_MOCKING_LOGIN, IS_MOCKING_FETCH_TOURNAMENTS, …)
│   ├── auth.ts             # Login, register, fetchProfile, updateProfile, registerPushToken
│   ├── tournaments.ts      # Tournaments CRUD + MyTournament cache + fetchNearbyTournaments
│   ├── teams.ts            # Teams CRUD + mock cache
│   ├── favorites.ts        # Favorites CRUD (fetchFavorites, addFavorite, removeFavorite)
│   └── searchLocation.ts   # Nominatim (OpenStreetMap) location search → Suggestion[] with lat/lng
├── context/
│   ├── AuthContext.tsx     # User session, login/logout, updateProfile; bootstrapping; profile switching
│   ├── TeamsContext.tsx    # Teams list, create/addMember/removeMember; backed by useQuery/useMutation
│   ├── NotificationsContext.tsx  # In-app notification list + addNotification
│   └── FavoritesContext.tsx      # Tournament bookmarks; optimistic updates via setQueryData
├── hooks/
│   ├── useNotificationSetup.ts      # No-op on non-iOS
│   └── useNotificationSetup.ios.ts  # iOS notification setup
├── navigation/
│   ├── AppNavigator.tsx             # Root stack navigator
│   ├── MainTabNavigator/
│   │   ├── MainTabNavigator.tsx     # Bottom tabs (Home/Esplora/Preferiti/Profilo)
│   │   └── MainTabNavigator.styles.ts
│   └── navigationRef.ts             # Global navigation ref for use outside components
├── components/             # Shared UI components (each in their own subdirectory)
│   ├── AuthLayout/
│   ├── AuthErrorBox/
│   ├── Avatar/
│   ├── Button/
│   ├── CompetoLogo/
│   ├── DividerAccess/
│   ├── InputBox/
│   ├── OnboardingCarousel/
│   └── TabBar/
└── screens/                # Each screen in its own subdirectory: Screen/Screen.tsx + Screen/Screen.styles.ts
    ├── Home/               # Feed: I Tuoi Tornei + Esplora + map
    ├── Explore/            # Tournament discovery with map
    ├── Favorites/          # Bookmarked tournaments
    ├── Profile/            # User profile + teams section + profile switcher
    ├── TournamentDetail/   # Tournament info + sign-up CTA
    ├── TournamentList/     # Tournament list view (not yet wired into navigation)
    ├── MyTournamentDetail/ # Bracket/groups live viewer (registered participant)
    ├── CreateTournamentSchedule/  # Multi-step tournament creation wizard (5 steps)
    ├── TournamentScheduleResult/  # Generated schedule preview
    ├── OrganizerProfile/          # View-only organizer profile
    ├── CreateOrganizerProfile/    # 5-step organizer onboarding form
    ├── InviteCollaborators/       # Add collaborators to organizer profile
    ├── TournamentHistory/         # Past tournaments list
    ├── Settings/
    ├── TeamSelect/         # Team picker modal (before payment)
    ├── Payment/            # Card payment form
    ├── Teams/              # Full teams list
    ├── CreateTeam/         # Create new team form
    ├── TeamDetail/         # Team detail + member management
    ├── InvitePlayers/      # Search users / share invite link
    ├── Login/
    ├── Register/
    ├── ChoseAccess/        # Entry screen for unauthenticated users (login / register choice)
    ├── ForgotPassword/
    └── Notifications/
```

---

## Provider hierarchy (`App.tsx`)

```tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <TeamsProvider>
      <NotificationsProvider>
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      </NotificationsProvider>
    </TeamsProvider>
  </AuthProvider>
</QueryClientProvider>
```

---

## React Query (TanStack Query)

The app uses `@tanstack/react-query` for all async data fetching. The client is configured in `src/lib/queryClient.ts`.

**Query keys** are centralized in `src/lib/queryKeys.ts` — always use these factory functions, never inline key strings:

```ts
queryKeys.tournaments()          // ['tournaments']
queryKeys.myTournaments()        // ['myTournaments']
queryKeys.teams()                // ['teams']
queryKeys.pendingInvites()       // ['pendingInvites']
queryKeys.sentInvites(teamId)    // ['sentInvites', teamId]
queryKeys.favorites()            // ['favorites']
queryKeys.userSearch(query)      // ['userSearch', query]
```

**Per-context usage**:
- `AuthContext` — `useMutation` for login/register/updateProfile; `qc.clear()` on logout to wipe all cached data
- `TeamsContext` — `useQuery` for teams and pending invites; `useMutation` for create/invite/remove/role operations
- `FavoritesContext` — `useQuery` to load favorites; optimistic updates via `qc.setQueryData` before firing the API call
- `MyTournamentDetail` — `useQuery` for tournament data; `useMutation` for `activateTournament`
- `Payment` — `useMutation` for `signUpForTournament`

### Mock granular overrides

`src/api/mockFlags.ts` exports per-endpoint flags (e.g. `IS_MOCKING_LOGIN`, `IS_MOCKING_FETCH_TOURNAMENTS`). Set individual flags to `false` to hit the real API for that endpoint even when the global `isMocking` is `true`. This is the preferred way to test partial integrations during development.

---

## User profile system

`User` has a `profiles: UserProfile[]` array and a `currentProfileId` pointer. `UserProfile` is a discriminated union:

```ts
type UserProfile = PlayerProfile | OrganizerProfile;
// discriminant: profile.role (UserRole.PLAYER | UserRole.ORGANIZER)
```

`AuthContext` exposes:
- `currentProfile` — computed from `user.profiles.find(p => p.id === user.currentProfileId)` (falls back to index 0)
- `switchProfile(profileId)` — updates `currentProfileId`
- `addOrganizerProfile(orgName)` — creates a new `OrganizerProfile` and switches to it
- `updateOrgProfileData(profileId, updates)` — partial update of any `OrganizerProfile` field
- `addCollaborator(profileId, appUser)` — adds a collaborator to an organizer profile (deduplicates by id)

`OrganizerProfile` fields: `orgName`, `isCreator`, `collaborators: AppUser[]`, `pendingApproval: boolean`.

---

## Tournament creation wizard

`CreateTournamentSchedule` is a 5-step form driven by `STEP_TITLES_TOURNAMENT` in `src/constants/tournament.ts`. Formats and phases:

- **Phases**: `SINGLE` (one format end-to-end) | `MULTI` (groups phase → knockout phase)
- **Single formats**: `ROUND_ROBIN` | `KNOCKOUT` | `DOUBLE_ELIMINATION`
- **KO formats** (second phase in MULTI): same three options

`src/utils/tournamentGenerator.ts` contains the pure scheduling logic (`generateSchedule`, `computeStandings`). Key types: `GeneratorConfig`, `GeneratorOutput`, `GeneratorParticipant`, `GeneratorGroup`, `ScheduledMatch`.

`TournamentScheduleResult` shows the generated bracket/schedule before the organizer confirms.

### Organizer onboarding (`CreateOrganizerProfile`)

Five steps defined in `src/constants/organizer.ts` `STEP_TITLES_ORGANIZER`:
1. Identity → 2. Sede & Contatti → 3. Dati Legali → 4. Documenti → 5. Consensi

`EntityType` enum: `asd | ssd | societa | azienda | comune | privato | altro`
`LegalForm` enum: `associazione | srl | srls | spa | cooperativa | ditta_individuale | ente_pubblico | nessuna`

---

## Navigation

### Stack routes (`RootStackParamList`)

Initial route is `ChoseAccess` when logged out, `MainTabs` when a persisted token exists (resolved during `bootstrapping`).

| Route                       | Screen                  | Notes                                                                     |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `ChoseAccess`               | ChoseAccess             | Entry screen for unauthenticated users                                    |
| `MainTabs`                  | MainTabNavigator        | Initial route when authenticated                                          |
| `Login`                     | Login                   | `redirect?: "tournament"`, `tournamentId?` — redirects after login        |
| `Register`                  | Register                |                                                                           |
| `ForgotPassword`            | ForgotPassword          |                                                                           |
| `TournamentDetail`          | TournamentDetail        | `tournamentId`, `justRegistered?`                                         |
| `MyTournamentDetail`        | MyTournamentDetail      | `tournamentId`                                                            |
| `OrganizerTournamentDetail` | _(not yet implemented)_ | `tournamentId` — route defined, screen not yet created |
| `CreateTournamentSchedule`  | CreateTournamentSchedule | multi-step wizard |
| `TournamentScheduleResult`  | TournamentScheduleResult | generated schedule preview |
| `OrganizerProfile`          | OrganizerProfile        | view-only |
| `CreateOrganizerProfile`    | CreateOrganizerProfile  | 5-step onboarding |
| `InviteCollaborators`       | InviteCollaborators     | `profileId` |
| `TournamentHistory`         | TournamentHistory       | |
| `Settings`                  | Settings                | |
| `TeamSelect`                | TeamSelect              | Modal; `tournamentId`, `entryFee`, `tournamentName`                       |
| `Payment`                   | Payment                 | `tournamentId`, `entryFee`, `tournamentName`, `teamId?`, `teamName?`      |
| `Teams`                     | Teams                   |                                                                           |
| `CreateTeam`                | CreateTeam              |                                                                           |
| `TeamDetail`                | TeamDetail              | `teamId`                                                                  |
| `InvitePlayers`             | InvitePlayers           | `teamId`                                                                  |
| `Notifiche`                 | Notifications           |                                                                           |

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

`src/api/tournaments.ts` exports `getMyTournamentsCache()` so `Home` and `MyTournamentDetail` share the same `MyTournament[]` instances (consistent IDs across navigation).

---

## Styling conventions

- **Colors**: always use `src/theme/colors.ts` (`colors.primary`, `colors.danger`, etc.) instead of hardcoded hex values
  - `colors.primary`: `#e64326` · `colors.primaryGradientMid`: `#f2691a` · `colors.primaryGradientEnd`: `#f89d00`
  - `colors.danger`: `#d91a1a` · `colors.success`: `#10b981`
  - `colors.dark`: `#1e293b` · `colors.placeholder`: `#64748b` · `colors.grayDark`: `#94a3b8`
  - `colors.purpleBlue`: `#4f46e5` · `colors.gray`: `#f1f5f9` (screen background) · `colors.black` / `colors.white`
- **Gradient helpers**: `colorGradient` and `colorGradientReverse` arrays are exported from `colors.ts` for convenience
- **Gradient headers**: `<LinearGradient colors={colorGradient}>` (or `[colors.primary, colors.primaryGradientEnd]`)
- **Screen background**: `colors.gray` (`#f1f5f9`)
- **Text hierarchy**: `colors.dark` (primary) · `colors.placeholder` (secondary) · `colors.grayDark` (muted)
- **Card gradients**: `CARD_GRADIENTS` in `src/theme/dimension.ts` — array of 6 color-pair tuples for card backgrounds; cycle through these instead of picking ad-hoc colors
- **Button sizes**: `sizesEnum` in `src/theme/dimension.ts` provides `small | medium | big` presets with matching padding and font sizes
- **Style files are collocated** with their screen/component: `src/screens/Home/Home.styles.ts`, `src/components/Button/Button.styles.ts`. Never inline `StyleSheet.create` in screen files.
- Each style file uses a named export matching the original variable (e.g. `export const tds`, `export const s`, `export const bStyles`). Dimension/layout constants used in both the stylesheet and JSX (e.g. `BIG_W`, `CARD_WIDTH`, bracket constants) are also exported from the style file.
- `MyTournamentDetail.styles.ts` exports bracket layout constants: `CARD_H`, `CARD_W`, `COL_GAP`, `SLOT_H`, `LABEL_H`, `LINE_W`, `LINE_COLOR`.

---

## Key features

### Tournament bracket viewer (`MyTournamentDetailScreen`)

- **Groups** (`kind: 'groups'`): tab bar with Gironi + Classifica tabs; live score simulation via `setInterval` every 5s
- **Knockout** (`kind: 'knockout'`): Sofascore-style bracket with absolute-positioned connector lines between rounds; `BracketMatchCard` with orange left border for live matches
- Live simulation: `simulateLiveUpdate()` pure function, 40% chance of scoring per tick

### Team management

- `TeamsContext` provides: `createTeam`, `addMember`, `removeMember`, `getTeamById`, `refreshTeams`, `acceptInvite`, `rejectInvite`, `updateMemberRole`, plus state `pendingReceivedInvites` and `sentPendingInvites`
- **Role-based**: only `representative` can invite or remove members; enforced in both `TeamDetail` and `InvitePlayers`
- **Roles**: `TeamRole = 'representative' | 'calciatore' | 'allenatore' | 'portiere'`. Max 1 `allenatore` and 1 `portiere` per team; `representative` role is immutable
- **Pending invites**: `inviteMember` creates a `PendingInvite` rather than directly adding to `team.members`. Members appear in the roster only after calling `acceptInvite`
- **Invite notifications**: fired at the screen level (`InvitePlayers`) because `TeamsContext` wraps `NotificationsProvider` and cannot call `useNotifications` directly
- Duplicate team name check: same representative cannot create two teams with the same name (validated in `api/teams.ts → createTeam`)

### Favorites

- `FavoritesContext` provides: `favorites`, `addFavorite`, `removeFavorite`, `isFavorite`
- Loads favorites via `api/favorites.ts → fetchFavorites` on user login (resets to `[]` on logout)
- `addFavorite`/`removeFavorite` update state immediately then fire API call in the background (fire-and-forget `.catch(() => {})`)
- In mock mode `api/favorites.ts` keeps a module-level array as the backing store
- Bookmark button in `TournamentDetail` header; `Favorites` lists bookmarks with navigation to detail
- Auto-removed from favorites when a tournament is registered (in the `justRegistered` useEffect)

### Map interaction (`EsploraScreen`)

- Tapping a marker sets `selectedTournament` state → shows a bottom card overlay
- **Do not use `<Callout>`** — it is unreliable on Android with custom views. Use marker `onPress` + a positioned `View` overlay instead

### Push notification routing (`useNotificationSetup.ios.ts`)

- On mount: requests permission, then calls `getExpoPushTokenAsync()` + `registerPushToken(token, userToken)` to register with the backend (no-op in mock mode)
- Foreground/background taps: `addNotificationResponseReceivedListener`
- Cold-start (app killed): `getLastNotificationResponseAsync()` on mount
- Both paths use `navigateWhenReady()` which retries until `navigationRef.isReady()`
- Invite notification payload: `{ screen: 'Teams' }` → navigates to `Teams` (shows "INVITI IN SOSPESO")
- Tournament notification payload: `{ tournamentId }` → navigates to `TournamentDetail`

### Organizer tournament view (`OrganizerTournamentDetail`) — planned, not yet implemented

- Route is defined in `RootStackParamList` and referenced in mock data/types, but the screen component has not been created yet
- Intended to show registered teams with `TeamRegistrationStatus` (`pending_approval` | `rejected` | `accepted` | `paid`), team players with stats, and the bracket/groups view
- Will only be reachable by users with `isOrganizer: true` on the `User` object

### Genera torneo gate (`MyTournamentDetail`)

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

`tsconfig.json` extends `expo/tsconfig.base` with `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`. Do not introduce unused variables or parameters — the type checker will reject them.

**Known pre-existing error** (not introduced by this project's code):

- `src/hooks/useNotificationSetup.ios.ts`: `TS2322` — newer `expo-notifications` SDK requires `shouldShowBanner` and `shouldShowList` on `NotificationBehavior`. This is an upstream type mismatch; ignore it.

---

## Linting, formatting, and tests

- **No linter or formatter** is configured for the mobile app. Do not attempt to run eslint or prettier.
- **No test framework** is set up. There are no test files in the project.
- The web app (`apps/web`) has an ESLint config but is WIP and not the focus of active development.

---

## Environment

- **Node**: `>=20` (enforced in root `package.json` engines)
- `app.config.js` supports two env vars:
  - `MOCKING` — set to `"false"` to use the real API (default: `true`)
  - `API_URL` — override the API base URL (default: `https://api.competo.example.com`)
