import axios from "axios";

const GEOCODE_BASE_URL = "https://api.geoapify.com/v1/geocode/search";
const placeApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

const fallbackImages = [
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80",
];

const keywordImages = {
  tokyo:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
  shibuya:
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80",
  harajuku:
    "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=900&q=80",
  meiji:
    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=80",
  sensoji:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=900&q=80",
  asakusa:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=900&q=80",
  akihabara:
    "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80",
  ginza:
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80",
  park: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80",
  shrine:
    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=80",
  temple:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=900&q=80",
  museum:
    "https://images.unsplash.com/photo-1566127992631-137a642a90f4?auto=format&fit=crop&w=900&q=80",
  garden:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80",
  river:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  eiffel:
    "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=900&q=80",
  "ho chi minh":
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
  saigon:
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
};

const getStableFallbackImage = (textQuery) => {
  const query = textQuery?.toLowerCase() || "";

  const matchedKey = Object.keys(keywordImages).find((key) =>
    query.includes(key),
  );

  if (matchedKey) {
    return keywordImages[matchedKey];
  }

  const index =
    query.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    fallbackImages.length;

  return fallbackImages[index];
};

const cleanSearchText = (textQuery) => {
  return textQuery
    ?.split("&")[0]
    ?.replace(/free/gi, "")
    ?.replace(/vnd/gi, "")
    ?.replace(/\$/g, "")
    ?.replace(/€|₫/g, "")
    ?.replace(/[0-9]/g, "")
    ?.replace(/[^\w\s]/g, " ")
    ?.replace(/\s+/g, " ")
    ?.trim();
};

const getWikipediaPhoto = async (textQuery) => {
  try {
    const cleanQuery = cleanSearchText(textQuery);

    if (!cleanQuery) return null;

    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      cleanQuery,
    )}`;

    const res = await axios.get(wikiUrl);

    return (
      res?.data?.thumbnail?.source || res?.data?.originalimage?.source || null
    );
  } catch (error) {
    console.log("Wikipedia photo not found:", textQuery);
    return null;
  }
};

export const getPlacePhoto = async (textQuery) => {
  if (!textQuery) return getStableFallbackImage("");

  const cleanQuery = cleanSearchText(textQuery);

  try {
    const geoapifyRes = await axios.get(GEOCODE_BASE_URL, {
      params: {
        text: cleanQuery,
        limit: 1,
        apiKey: placeApiKey,
      },
    });

    console.log("Geoapify response:", geoapifyRes.data);

    const place = geoapifyRes?.data?.features?.[0];
    const geoapifyImage = place?.properties?.wiki_and_media?.image;

    if (geoapifyImage) {
      return geoapifyImage;
    }

    const wikipediaImage = await getWikipediaPhoto(cleanQuery);

    if (wikipediaImage) {
      return wikipediaImage;
    }

    return getStableFallbackImage(textQuery);
  } catch (error) {
    console.log("Geoapify photo error:", error);

    const wikipediaImage = await getWikipediaPhoto(cleanQuery);

    if (wikipediaImage) {
      return wikipediaImage;
    }

    return getStableFallbackImage(textQuery);
  }
};
