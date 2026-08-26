export interface CurrencyConfig {
  country: string;
  currency: string;
  symbol: string;
  locale: string;
}

const currencyMap: Record<string, CurrencyConfig> = {
  NG: {
    country: "NG",
    currency: "NGN",
    symbol: "₦",
    locale: "en-NG",
  },

  US: {
    country: "US",
    currency: "USD",
    symbol: "$",
    locale: "en-US",
  },

  GB: {
    country: "GB",
    currency: "GBP",
    symbol: "£",
    locale: "en-GB",
  },

  CA: {
    country: "CA",
    currency: "CAD",
    symbol: "$",
    locale: "en-CA",
  },

  AU: {
    country: "AU",
    currency: "AUD",
    symbol: "$",
    locale: "en-AU",
  },

  DE: {
    country: "DE",
    currency: "EUR",
    symbol: "€",
    locale: "de-DE",
  },

  FR: {
    country: "FR",
    currency: "EUR",
    symbol: "€",
    locale: "fr-FR",
  },

  IN: {
    country: "IN",
    currency: "INR",
    symbol: "₹",
    locale: "en-IN",
  },

  ZA: {
    country: "ZA",
    currency: "ZAR",
    symbol: "R",
    locale: "en-ZA",
  },
};

export function getCurrencyConfig(
  countryCode: string
): CurrencyConfig {
  return (
    currencyMap[countryCode] ?? {
      country: countryCode,
      currency: "USD",
      symbol: "$",
      locale: "en-US",
    }
  );
}