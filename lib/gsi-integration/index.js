/**
 * GSD Integration Module
 * 
 * Provides tools for tracking, analyzing, and integrating updates from the
 * get-shit-done npm package into GSI (Get-Shit-Implemented).
 * 
 * @module lib/gsi-integration
 */

const { 
  ChangeCategories, 
  analyzeChanges, 
  categorizeChanges, 
  assessChanges 
} = require('./change-analyzer');

const { 
  downloadGSDPackage, 
  cleanupDownload, 
  cleanupAllDownloads 
} = require('./downloader');

const { 
  suggestIntegrations, 
  generateIntegrationPlan, 
  createMergeStrategy 
} = require('./suggester');

const { 
  recordUpdate, 
  recordIntegration, 
  getUpdateHistory, 
  getIntegratedChanges, 
  getDeferredChanges, 
  isChangeIntegrated, 
  getIntegrationStats, 
  getTrackingData, 
  saveTrackingData 
} = require('./tracker');

const { 
  getLatestGSDVersion, 
  getInstalledGSDVersion, 
  hasUpdateAvailable, 
  updateTrackingData 
} = require('./version-checker');

module.exports = {
  // Change analyzer
  ChangeCategories,
  analyzeChanges,
  categorizeChanges,
  assessChanges,
  
  // Downloader
  downloadGSDPackage,
  cleanupDownload,
  cleanupAllDownloads,
  
  // Suggester
  suggestIntegrations,
  generateIntegrationPlan,
  createMergeStrategy,
  
  // Tracker
  recordUpdate,
  recordIntegration,
  getUpdateHistory,
  getIntegratedChanges,
  getDeferredChanges,
  isChangeIntegrated,
  getIntegrationStats,
  getTrackingData,
  saveTrackingData,
  
  // Version checker
  getLatestGSDVersion,
  getInstalledGSDVersion,
  hasUpdateAvailable,
  updateTrackingData
};
