export function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

/**
 * Extracts a clean, capitalized first name from an email address or user object/string.
 * Handles patterns such as:
 * - "bikramnayak01995@gmail.com" -> "Bikram"
 * - "bikram.nayak@gmail.com" -> "Bikram"
 * - "bikram_nayak@gmail.com" -> "Bikram"
 * - "Bikramnayak01995" -> "Bikram"
 * - "Bikram Nayak" -> "Bikram"
 * - "john.doe@example.com" -> "John"
 */
export function extractFirstName(input) {
  if (!input) return "there";

  let str = "";
  if (typeof input === "object") {
    str = input.email || input.fullName || input.name || "";
  } else if (typeof input === "string") {
    str = input.trim();
  }

  if (!str) return "there";

  // If input contains '@', take the local part before '@'
  if (str.includes("@")) {
    str = str.split("@")[0].trim();
  }

  // If there are spaces, the first word is the first name
  if (str.includes(" ")) {
    const firstWord = str.split(/\s+/)[0];
    if (firstWord && firstWord.length > 0) {
      return capitalize(cleanDigits(firstWord));
    }
  }

  // Split on common delimiters (. _ - +)
  const delimiterParts = str.split(/[._\-+]+/);
  if (delimiterParts.length > 1 && delimiterParts[0]) {
    const cleaned = cleanDigits(delimiterParts[0]);
    if (cleaned.length >= 2) {
      return capitalize(cleaned);
    }
  }

  // Strip leading and trailing numbers
  let clean = str.replace(/^\d+|\d+$/g, "");

  // Check camelCase (e.g., "bikramNayak" or "BikramNayak")
  const camelMatch = clean.match(/^[a-z]+(?=[A-Z])|^[A-Z][a-z]+(?=[A-Z])/);
  if (camelMatch && camelMatch[0] && camelMatch[0].length >= 2) {
    return capitalize(camelMatch[0]);
  }

  // Common surnames to separate concatenated names (e.g., "bikramnayak" -> "bikram")
  const commonSurnames = [
    "nayak", "kumar", "sharma", "singh", "patel", "verma", "gupta", "reddy",
    "rao", "mishra", "jain", "das", "roy", "sen", "dey", "paul", "bose",
    "ghosh", "shah", "joshi", "bhat", "hegde", "shetty", "nair", "menon",
    "pillai", "iyer", "iyengar", "chaudhary", "yadav", "pandey", "khatri",
    "thakur", "dubey", "tiwari", "choudhury", "mukherjee", "banerjee", "chatterjee"
  ];

  const lower = clean.toLowerCase();
  for (const sn of commonSurnames) {
    if (lower.endsWith(sn) && lower.length > sn.length) {
      const prefix = lower.slice(0, -sn.length);
      if (prefix.length >= 2) {
        return capitalize(prefix);
      }
    }
  }

  // Fallback: strip any remaining numbers and capitalize
  const lettersOnly = clean.replace(/\d+/g, "");
  if (lettersOnly.length >= 2) {
    return capitalize(lettersOnly);
  }

  return capitalize(clean || "there");
}

function cleanDigits(str) {
  return str.replace(/\d+/g, "");
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

