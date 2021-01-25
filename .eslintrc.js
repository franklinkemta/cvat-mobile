module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'prettier',
    'prettier/@typescript-eslint',
    'eslint-plugin-no-inline-styles',
  ],
  rules: {
    'react-native/no-inline-styles': 2,
    'no-inline-styles/no-inline-styles': 2,
  },
};
