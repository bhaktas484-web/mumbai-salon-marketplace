import { logger } from "./logger";

/* ── Types ───────────────────────────────────────────── */
export interface GeocodeResult {
  lat:          number;
  lng:          number;
  formattedAddress: string;
  area:         string;
  city:         string;
  pincode:      string;
  landmark?:    string;
}

/* ── Mumbai area lookup (pincode → area name) ─────────── */
const MUMBAI_PINCODES: Record<string, string> = {
  "400001": "Colaba",       "400002": "Kalbadevi",  "400003": "Masjid Bunder",
  "400004": "Girgaon",      "400005": "Colaba",     "400006": "Malabar Hill",
  "400007": "Grant Road",   "400008": "Grant Road",  "400009": "Mazgaon",
  "400010": "Mazgaon",      "400011": "Parel",       "400012": "Sewri",
  "400013": "Dadar",        "400014": "Dadar",       "400015": "Lalbaug",
  "400016": "Mahim",        "400017": "Dharavi",     "400018": "Worli",
  "400019": "Matunga",      "400020": "Churchgate",  "400021": "Cuffe Parade",
  "400022": "Sion",         "400024": "Wadala",      "400025": "Prabhadevi",
  "400026": "Lower Parel",  "400028": "Worli",       "400029": "Dadar",
  "400030": "Sewri",        "400031": "Chembur",     "400032": "Ghatkopar",
  "400033": "Trombay",      "400034": "Chembur",     "400037": "Ghatkopar",
  "400043": "Vikhroli",     "400049": "Juhu",        "400050": "Bandra",
  "400051": "Bandra",       "400052": "Khar",        "400053": "Santacruz",
  "400054": "Santacruz",    "400055": "Vile Parle",  "400056": "Andheri",
  "400057": "Andheri",      "400058": "Andheri",     "400059": "Andheri",
  "400060": "Jogeshwari",   "400061": "Goregaon",    "400062": "Malad",
  "400063": "Malad",        "400064": "Kandivali",   "400065": "Borivali",
  "400066": "Borivali",     "400067": "Goregaon",    "400068": "Powai",
  "400069": "Vikhroli",     "400070": "Kurla",       "400071": "Chembur",
  "400072": "Govandi",      "400074": "Mankhurd",    "400075": "Ghatkopar",
  "400076": "Mulund",       "400077": "Bhandup",     "400078": "Kanjurmarg",
  "400079": "Mulund",       "400080": "Kurla",       "400081": "Powai",
  "400082": "Chandivali",   "400083": "Vikhroli",    "400084": "Ghatkopar",
  "400086": "Andheri",      "400088": "Jogeshwari",  "400093": "Borivali",
  "400097": "Kandivali",    "400101": "Dahisar",     "400104": "Kandivali",
  "401107": "Thane",        "400601": "Thane",       "400614": "Navi Mumbai",
  "400703": "Navi Mumbai",  "400706": "Navi Mumbai",
};

/* ── Forward geocode via Google Maps API ─────────────── */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env["GOOGLE_MAPS_KEY"];
  if (!apiKey) {
    logger.warn("GOOGLE_MAPS_KEY not set — using fallback geocoder");
    return fallbackGeocode(address);
  }

  try {
    const encoded = encodeURIComponent(`${address}, Mumbai, India`);
    const url     = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}&region=in`;

    const response = await fetch(url);
    const data     = await response.json() as {
      status: string;
      results: Array<{
        geometry:              { location: { lat: number; lng: number } };
        formatted_address:     string;
        address_components:    Array<{ long_name: string; types: string[] }>;
      }>;
    };

    if (data.status !== "OK" || !data.results[0]) {
      logger.warn(`Geocode failed for address: ${address} — status: ${data.status}`);
      return null;
    }

    const result     = data.results[0];
    const components = result.address_components;

    const getComponent = (type: string) =>
      components.find(c => c.types.includes(type))?.long_name ?? "";

    const pincode = getComponent("postal_code");
    const area    = MUMBAI_PINCODES[pincode] ?? (
                    getComponent("sublocality_level_1") ||
                    getComponent("sublocality") ||
                    getComponent("locality")
                  );

    return {
      lat:              result.geometry.location.lat,
      lng:              result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      area,
      city:    getComponent("locality") || "Mumbai",
      pincode,
    };
  } catch (err) {
    logger.error("Geocode error:", err);
    return null;
  }
}

/* ── Reverse geocode: coords → address ───────────────── */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  const apiKey = process.env["GOOGLE_MAPS_KEY"];
  if (!apiKey) return null;

  try {
    const url  = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&region=in`;
    const res  = await fetch(url);
    const data = await res.json() as {
      status: string;
      results: Array<{
        geometry:           { location: { lat: number; lng: number } };
        formatted_address:  string;
        address_components: Array<{ long_name: string; types: string[] }>;
      }>;
    };

    if (data.status !== "OK" || !data.results[0]) return null;

    const result     = data.results[0];
    const components = result.address_components;
    const getComp    = (type: string) =>
      components.find(c => c.types.includes(type))?.long_name ?? "";

    const pincode = getComp("postal_code");
    const area    = MUMBAI_PINCODES[pincode] ?? getComp("sublocality_level_1") ?? getComp("sublocality");

    return {
      lat, lng,
      formattedAddress: result.formatted_address,
      area,
      city:    getComp("locality") || "Mumbai",
      pincode,
    };
  } catch (err) {
    logger.error("Reverse geocode error:", err);
    return null;
  }
}

/* ── Get area from pincode ───────────────────────────── */
export function getAreaFromPincode(pincode: string): string {
  return MUMBAI_PINCODES[pincode] ?? "Mumbai";
}

/* ── Haversine distance (km) ─────────────────────────── */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Fallback geocoder (hardcoded Mumbai landmarks) ───── */
function fallbackGeocode(address: string): GeocodeResult | null {
  const LANDMARKS: Record<string, { lat: number; lng: number; area: string; pincode: string }> = {
    "bandra":       { lat: 19.0596, lng: 72.8295, area: "Bandra",      pincode: "400050" },
    "juhu":         { lat: 19.0990, lng: 72.8269, area: "Juhu",        pincode: "400049" },
    "andheri":      { lat: 19.1197, lng: 72.8479, area: "Andheri",     pincode: "400058" },
    "colaba":       { lat: 18.9067, lng: 72.8147, area: "Colaba",      pincode: "400005" },
    "worli":        { lat: 19.0177, lng: 72.8155, area: "Worli",       pincode: "400018" },
    "lower parel":  { lat: 18.9977, lng: 72.8301, area: "Lower Parel", pincode: "400026" },
    "powai":        { lat: 19.1176, lng: 72.9060, area: "Powai",       pincode: "400076" },
    "malad":        { lat: 19.1871, lng: 72.8482, area: "Malad",       pincode: "400064" },
    "borivali":     { lat: 19.2307, lng: 72.8567, area: "Borivali",    pincode: "400091" },
    "santacruz":    { lat: 19.0822, lng: 72.8394, area: "Santacruz",   pincode: "400054" },
    "dadar":        { lat: 19.0178, lng: 72.8478, area: "Dadar",       pincode: "400014" },
    "chembur":      { lat: 19.0522, lng: 72.8999, area: "Chembur",     pincode: "400071" },
  };

  const lower = address.toLowerCase();
  for (const [key, coords] of Object.entries(LANDMARKS)) {
    if (lower.includes(key)) {
      return {
        ...coords,
        formattedAddress: address,
        city:             "Mumbai",
      };
    }
  }
  return null;
}