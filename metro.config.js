const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure Metro resolves common JS module extensions used by some packages
config.resolver = config.resolver || {};
config.resolver.sourceExts = config.resolver.sourceExts || [];
// Add cjs and mjs in case dependencies export those file types
if (!config.resolver.sourceExts.includes("cjs"))
  config.resolver.sourceExts.push("cjs");
if (!config.resolver.sourceExts.includes("mjs"))
  config.resolver.sourceExts.push("mjs");

module.exports = withNativeWind(config, { input: "./app/globals.css" });
