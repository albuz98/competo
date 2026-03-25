module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), 'expo-secure-store'],
  extra: {
    mocking: process.env.MOCKING !== 'false',
    apiUrl: process.env.API_URL ?? 'https://api.competo.example.com',
  },
});
