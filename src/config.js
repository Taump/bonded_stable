export default {
  TESTNET: true,
  FACTORY_AA: "RR4B5QDWFR6ISAIA7RPDH5O3QQZYOIWK",
  TOKEN_REGISTRY: "O6H6ZIFI57X3PLTYHOCVYPP5A553CYFQ",
  SIMPLESWAP_API_KEY: "51bc6147-b4fc-4df0-9792-a82ce756a9e3",
  BUFFER_URL: "ostable.org/api",
  reserves: {
    base: {
      name: "GBYTE",
      decimals: 9,
      oracle: "F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N",
      feed_name: "GBYTE_USD",
      feedCurrency: "USD",
    },
  },
  interestRecepients: [
    { name: "Obyte Foundation", address: "FCXZXQR353XI4FIPQL6U4G2EQJL4CCU2" },
    {
      name: "Estonian Cryptocurrency Association",
      address: "VJDEB7JEBHJWW6DPTLYYUBDAVOYKZYB4",
    },
  ],
  pegged: {
    // for landing page
    USD: {
      stableName: "OUSD",
      interestName: "IUSD",
      growthName: "GRD",
      percent: 14,
      address: "ZSLRU3JMJSXRNM4YXQASFEGOOJ2FAP7F",
    },
    BTC: {
      stableName: "OBIT",
      interestName: "IBIT",
      growthName: "GRB",
      percent: 10,
      address: "ZSLRU3JMJSXRNM4YXQASFEGOOJ2FAP7F",
    },
    GOLD: {
      stableName: "OAU",
      interestName: "IAU",
      growthName: "GRAU",
      percent: 8,
      address: "ZSLRU3JMJSXRNM4YXQASFEGOOJ2FAP7F",
    },
  },
};
