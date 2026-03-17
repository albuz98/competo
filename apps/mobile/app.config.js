module.exports = ({ config }) => ({
  ...config,
  extra: {
    mocking: process.env.MOCKING !== 'false',
    apiUrl: process.env.API_URL ?? 'https://api.competo.example.com',
  },
});
