module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 'react-native-worklets-core/plugin',   // add later when vision-camera needed
      'react-native-reanimated/plugin',      // must be LAST
    ],
  };
};
