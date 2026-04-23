import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";

export async function submitOrganizerProfile(
  orgName: string,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_SUBMIT_ORGANIZER_PROFILE) {
    await new Promise((r) => setTimeout(r, 800));
    return;
  }
  return apiFetch<void>(
    "/organizer/profile",
    { method: "POST", body: JSON.stringify({ orgName }) },
    token,
  );
}
