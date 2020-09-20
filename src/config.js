export default {
  TESTNET: process.env.REACT_APP_TESTNET === "true",
  FACTORY_AA: process.env.REACT_APP_FACTORY_AA,
  TOKEN_REGISTRY: process.env.REACT_APP_TOKEN_REGISTRY,
  SIMPLESWAP_API_KEY: process.env.REACT_APP_SIMPLESWAP_API_KEY,
  BUFFER_URL: process.env.BUFFER_URL,
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
