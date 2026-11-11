/**
 * Reverse geocodes coordinates into "Locality, Area, City" format using Google Maps
 * with resilient fallback to geocoding services.
 */
export async function reverseGeocodeGoogle(latitude, longitude) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1. Google Maps JS API if already loaded
  if (typeof window !== "undefined" && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === "OK" && results?.[0]) resolve(results[0]);
          else reject(new Error(status));
        });
      });
      return formatGoogleComponents(result.address_components);
    } catch (e) {
      console.warn("Google Maps JS API geocode failed, trying REST/fallback:", e);
    }
  }

  // 2. Google Maps Geocoding REST API if API Key is configured
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.status === "OK" && data.results?.[0]) {
          return formatGoogleComponents(data.results[0].address_components);
        }
      }
    } catch (e) {
      console.warn("Google Maps REST geocode failed, trying fallback:", e);
    }
  }

  // 3. Fallback: Free reverse geocode via OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.road ||
        addr.quarter ||
        "Locality";
      const area =
        addr.city_district ||
        addr.suburb ||
        addr.county ||
        addr.district ||
        "Area";
      const city =
        addr.city ||
        addr.town ||
        addr.state_district ||
        addr.state ||
        "City";
      return `${locality}, ${area}, ${city}`;
    }
  } catch (e) {
    console.warn("Nominatim reverse geocode failed:", e);
  }

  // 4. Fallback: BigDataCloud client reverse geocoding
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.subLocality || "Locality";
      const area = data.city || data.principalSubdivision || "Area";
      const city = data.countryName || "City";
      return `${locality}, ${area}, ${city}`;
    }
  } catch (e) {
    console.warn("BigDataCloud reverse geocode failed:", e);
  }

  return null;
}

function formatGoogleComponents(components = []) {
  let locality = "";
  let area = "";
  let city = "";

  for (const c of components) {
    const types = c.types || [];
    if (
      types.includes("sublocality_level_1") ||
      types.includes("sublocality") ||
      types.includes("neighborhood") ||
      types.includes("point_of_interest")
    ) {
      if (!locality) locality = c.long_name;
    } else if (
      types.includes("sublocality_level_2") ||
      types.includes("administrative_area_level_2")
    ) {
      if (!area) area = c.long_name;
    } else if (types.includes("locality")) {
      if (!city) city = c.long_name;
      else if (!area) area = c.long_name;
    } else if (types.includes("administrative_area_level_1")) {
      if (!city) city = c.long_name;
    }
  }

  if (!locality && components.length > 0) locality = components[0].long_name;
  if (!area && components.length > 1) area = components[1].long_name;
  if (!city && components.length > 2) city = components[2].long_name;

  return `${locality || "Locality"}, ${area || "Area"}, ${city || "City"}`;
}

export async function getCurrentLocationFromGoogleMaps() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const formatted = await reverseGeocodeGoogle(latitude, longitude);
          if (formatted) {
            resolve(formatted);
          } else {
            resolve(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}, Current Location`);
          }
        } catch (err) {
          reject(err);
        }
      },
      (err) => {
        let msg = "Could not detect location.";
        if (err.code === 1) msg = "Location permission was denied. Please allow location access in your browser.";
        else if (err.code === 2) msg = "Position unavailable. Please try again.";
        else if (err.code === 3) msg = "Location request timed out.";
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}
