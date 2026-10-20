const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Treat .html files as assets (bundled), not as JS source modules.
config.resolver.assetExts = config.resolver.assetExts.concat(['html']);
config.resolver.sourceExts = config.resolver.sourceExts.filter((e) => e !== 'html');

module.exports = config;
