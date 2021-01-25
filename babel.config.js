module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '': './app',
        },
      },
    ],
    // ['macros'],
  ],
  // env : {}
};
