/**
 * Module Registry System
 * 
 * Central registry for all lib/ modules with health metrics,
 * dependency tracking, and module classification.
 * 
 * @module lib/module-registry
 */

const { ModuleRegistry } = require('./registry');
const { ModuleHealth } = require('./health');
const { DependencyTracker } = require('./dependencies');

module.exports = {
  ModuleRegistry,
  ModuleHealth,
  DependencyTracker
};
