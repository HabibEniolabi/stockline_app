// const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path');

// const projectRoot = __dirname;
// const workspaceRoot = path.resolve(projectRoot, '../..');

// const config = getDefaultConfig(projectRoot);

// // Watch the entire workspace so monorepo libs are picked up
// config.watchFolders = [workspaceRoot];

// // Resolve modules from both project and workspace node_modules
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(workspaceRoot, 'node_modules'),
// ];

// config.resolver.disableHierarchicalLookup = true;
 
// module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;