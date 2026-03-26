/**
 * Parse coordinates from common formats (Google Maps URL, DMS, Decimal).
 *
 * Returns null if the value can't be parsed or is out of bounds.
 * Returns { lat, lng } as strings fixed to 6 decimals.
 */
export const parseCoordinates = (val) => {
  if (!val) return null;

  let parsedLat = null;
  let parsedLng = null;

  const str = String(val);

  // Example: https://www.google.com/maps/.../@10.8231,106.6297,15z
  const urlMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (urlMatch) {
    parsedLat = parseFloat(urlMatch[1]);
    parsedLng = parseFloat(urlMatch[2]);
  } else if (str.match(/[°'"]/) ) {
    // Example: 10°49'23"N 106°37'47"E
    const dmsRegex =
      /(\d+)[°\s]+(\d+)['\s]+(\d+(?:\.\d+)?)"?\s*([NS])\s*[\s,]*(\d+)[°\s]+(\d+)['\s]+(\d+(?:\.\d+)?)"?\s*([EW])/i;
    const dmsMatch = str.match(dmsRegex);
    if (dmsMatch) {
      parsedLat =
        parseInt(dmsMatch[1], 10) +
        parseInt(dmsMatch[2], 10) / 60 +
        parseFloat(dmsMatch[3]) / 3600;
      if (dmsMatch[4].toUpperCase() === "S") parsedLat = -parsedLat;

      parsedLng =
        parseInt(dmsMatch[5], 10) +
        parseInt(dmsMatch[6], 10) / 60 +
        parseFloat(dmsMatch[7]) / 3600;
      if (dmsMatch[8].toUpperCase() === "W") parsedLng = -parsedLng;
    }
  } else {
    // Example: 10.8231, 106.6297 (also handles separators)
    const decimalMatch = str.match(/(-?\d+\.\d+)[^\d-]+(-?\d+\.\d+)/);
    if (decimalMatch) {
      parsedLat = parseFloat(decimalMatch[1]);
      parsedLng = parseFloat(decimalMatch[2]);
      if (str.match(/S/i)) parsedLat = -Math.abs(parsedLat);
      if (str.match(/W/i)) parsedLng = -Math.abs(parsedLng);
    } else {
      // Fallback: grab first 2 numbers
      const fallbackMatch = str.match(/-?\d+(?:\.\d+)?/g);
      if (fallbackMatch && fallbackMatch.length >= 2) {
        parsedLat = parseFloat(fallbackMatch[0]);
        parsedLng = parseFloat(fallbackMatch[1]);
      }
    }
  }

  if (
    parsedLat === null ||
    parsedLng === null ||
    Number.isNaN(parsedLat) ||
    Number.isNaN(parsedLng)
  ) {
    return null;
  }

  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    return null;
  }

  return { lat: parsedLat.toFixed(6), lng: parsedLng.toFixed(6) };
};
