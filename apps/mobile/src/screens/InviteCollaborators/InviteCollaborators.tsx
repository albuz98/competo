import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Share,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { ic } from "./InviteCollaborators.styles";
import { searchUsers } from "../../api/teams";
import {
  ButtonBack,
  ButtonFullColored,
  ButtonIcon,
} from "../../components/core/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { TabBar } from "../../components/core/TabBar/TabBar";
import { colors } from "../../theme/colors";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { AppUser } from "../../types/team";
import { OrganizerProfile, UserRole } from "../../types/user";

type Props = NativeStackScreenProps<RootStackParamList, "InviteCollaborators">;
type Tab = "cerca" | "condividi";

function UserRow({
  user,
  alreadyCollaborator,
  invited,
  onInvite,
}: {
  user: AppUser;
  alreadyCollaborator: boolean;
  invited: boolean;
  onInvite: () => void;
}) {
  const initials = (user.first_name[0] ?? "") + (user.last_name[0] ?? "");
  return (
    <View style={ic.userRow}>
      <View style={ic.userAvatar}>
        <Text style={ic.userAvatarText}>{initials.toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ic.userName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={ic.userUsername}>@{user.username}</Text>
      </View>
      {alreadyCollaborator ? (
        <View style={ic.alreadyBadge}>
          <Text style={ic.alreadyBadgeText}>Già collaboratore</Text>
        </View>
      ) : invited ? (
        <View style={ic.invitedBadge}>
          <Ionicons name="checkmark" size={14} color={colors.success} />
          <Text style={ic.invitedBadgeText}>Aggiunto</Text>
        </View>
      ) : (
        <ButtonFullColored
          text="Aggiungi"
          handleBtn={onInvite}
          isColored
          size={sizesEnum.small}
        />
      )}
    </View>
  );
}

export default function InviteCollaborators({ route, navigation }: Props) {
  const { profileId } = route.params;
  const { user, addCollaborator } = useAuth();
  const { addNotification } = useNotifications();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<Tab>("cerca");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orgProfile = user?.profiles?.find(
    (p) => p.id === profileId && p.role === UserRole.ORGANIZER,
  ) as OrganizerProfile | undefined;

  const collaboratorIds = new Set(
    orgProfile?.collaborators?.map((c) => c.id) ?? [],
  );
  const inviteLink = `competo://org/invite/${profileId}`;

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await searchUsers(query, user?.token ?? "");
        setResults(res);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query]);

  const handleAdd = (appUser: AppUser) => {
    addCollaborator(profileId, appUser);
    setAdded((prev) => new Set(prev).add(appUser.id));
    addNotification({
      title: "Collaboratore aggiunto",
      body: `${appUser.first_name} ${appUser.last_name} è stato aggiunto come collaboratore di ${orgProfile?.orgName ?? ""}`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Unisciti alla mia organizzazione su Competo! ${inviteLink}`,
        title: `Diventa collaboratore di ${orgProfile?.orgName ?? ""}`,
      });
    } catch {
      // user cancelled
    }
  };

  return (
    <View style={ic.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={ic.header}>
          <ButtonBack
            handleBtn={() =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (navigation as any).navigate(NavigationEnum.MAIN_TABS, {
                screen: NavigationEnum.PROFILE,
                params: { startEdit: true },
              })
            }
            isArrowBack={false}
          />
          <Text style={ic.headerTitle}>Invita collaboratori</Text>
          <View style={{ width: 36 }} />
        </View>
        {orgProfile && <Text style={ic.orgName}>{orgProfile.orgName}</Text>}

        {/* Tab bar */}
        <TabBar
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "cerca", label: "Cerca", icon: "search" },
            { key: "condividi", label: "Condividi link", icon: "share-social" },
          ]}
        />

        {tab === "cerca" ? (
          <>
            {/* Search input */}
            <View style={ic.searchWrap}>
              <Ionicons
                name="search"
                size={18}
                color={colors.placeholder}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={ic.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Cerca per nome o username..."
                placeholderTextColor={colors.placeholder}
                autoFocus={tab === "cerca"}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <ButtonIcon
                  handleBtn={() => setQuery("")}
                  icon={
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.grayDark}
                    />
                  }
                />
              )}
            </View>

            {/* Results */}
            {searching ? (
              <ActivityIndicator
                color={colors.primaryGradientMid}
                style={{ marginTop: 32 }}
              />
            ) : query.trim().length === 0 ? (
              <View style={ic.hintBox}>
                <Ionicons
                  name="people-outline"
                  size={40}
                  color={colors.disabled}
                />
                <Text style={ic.hintText}>
                  Cerca un utente per nome o username per aggiungerlo come
                  collaboratore.
                </Text>
              </View>
            ) : results.length === 0 ? (
              <View style={ic.hintBox}>
                <Text style={ic.hintText}>
                  Nessun utente trovato per "{query}"
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(u) => u.id}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                renderItem={({ item }) => (
                  <UserRow
                    user={item}
                    alreadyCollaborator={collaboratorIds.has(item.id)}
                    invited={added.has(item.id)}
                    onInvite={() => handleAdd(item)}
                  />
                )}
              />
            )}
          </>
        ) : (
          /* Share link tab */
          <View style={ic.shareTab}>
            <View style={ic.shareIllustration}>
              <Ionicons
                name="link"
                size={36}
                color={colors.primaryGradientMid}
              />
            </View>
            <Text style={ic.shareTitle}>Condividi il link di invito</Text>
            <Text style={ic.shareSub}>
              Chiunque clicchi questo link potrà unirsi come collaboratore di{" "}
              {orgProfile?.orgName ?? "questa organizzazione"}.
            </Text>
            <View style={ic.linkBox}>
              <Text style={ic.linkText} numberOfLines={1}>
                {inviteLink}
              </Text>
            </View>
            <ButtonFullColored
              iconRight={
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={colors.white}
                />
              }
              text="Condividi"
              handleBtn={handleShare}
              isColored
            />
            <View style={ic.socialRow}>
              {(
                ["logo-whatsapp", "logo-instagram", "mail-outline"] as const
              ).map((icon) => (
                <ButtonIcon
                  key={icon}
                  style={ic.socialBtn}
                  handleBtn={handleShare}
                  icon={
                    <Ionicons
                      name={icon}
                      size={22}
                      color={colors.placeholder}
                    />
                  }
                />
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
