const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// For web, map react-native-maps to react-native-web-maps
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native-maps': require.resolve('react-native-web-maps'),
};

module.exports = config;
