import { Suggestion } from "../types/location";

export async function searchNominatim(query: string): Promise<Suggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Competo/1.0 (mobile app)' },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return (data as any[]).map((item) => ({
    displayName: item.display_name as string,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}
