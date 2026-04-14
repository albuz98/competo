import { User, UserProfile, UserRole } from "../types";

export const getProfileSubtitle = (
  profile: UserProfile | null,
  user: User,
): string | undefined => {
  if (!profile) return user?.location;
  if (profile.role === UserRole.ORGANIZER) {
    const count = profile.collaborators?.length ?? 0;
    return `Collaboratori ${count}`;
  }
  return user?.location;
};
