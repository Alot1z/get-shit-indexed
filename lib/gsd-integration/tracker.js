/**
 * GSD Update Tracker
 * 
 * Tracks GSD update history and integration status
 */

const fs = require('fs').promises;
const path = require('path');

const TRACKING_FILE = path.join(__dirname, '../../.planning/gsd-integration-tracking.json');

/**
 * Record update detection
 */
async function recordUpdate(version, changes) {
  const tracking = await getTrackingData();
  
  tracking.versionHistory.push({
    version,
    detectedAt: new Date().toISOString(),
    changes: {
      added: changes.added.length,
      removed: changes.removed.length,
      modified: changes.modified.length,
      total: changes.total
    },
    status: 'DETECTED'
  });
  
  await saveTrackingData(tracking);
}

/**
 * Record integration attempt
 */
async function recordIntegration(version, changeId, status, notes = null) {
  const tracking = await getTrackingData();
  
  const integration = {
    changeId,
    version,
    status,
    timestamp: new Date().toISOString(),
    notes
  };
  
  if (status === 'INTEGRATED') {
    tracking.integratedChanges.push(integration);
  } else if (status === 'DEFERRED') {
    tracking.deferredChanges.push(integration);
  }
  
  await saveTrackingData(tracking);
}

/**
 * Get update history
 */
async function getUpdateHistory(limit = 10) {
  const tracking = await getTrackingData();
  const history = tracking.versionHistory || [];
  
  // Return most recent first
  return history
    .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt))
    .slice(0, limit);
}

/**
 * Get integrated changes
 */
async function getIntegratedChanges(version = null) {
  const tracking = await getTrackingData();
  const changes = tracking.integratedChanges || [];
  
  if (version) {
    return changes.filter(c => c.version === version);
  }
  
  return changes;
}

/**
 * Get deferred changes
 */
async function getDeferredChanges(version = null) {
  const tracking = await getTrackingData();
  const changes = tracking.deferredChanges || [];
  
  if (version) {
    return changes.filter(c => c.version === version);
  }
  
  return changes;
}

/**
 * Check if change was already integrated
 */
async function isChangeIntegrated(changeId) {
  const tracking = await getTrackingData();
  return (tracking.integratedChanges || []).some(c => c.changeId === changeId);
}

/**
 * Get integration statistics
 */
async function getIntegrationStats() {
  const tracking = await getTrackingData();
  
  const totalDetected = (tracking.versionHistory || []).length;
  const totalIntegrated = (tracking.integratedChanges || []).length;
  const totalDeferred = (tracking.deferredChanges || []).length;
  
  return {
    totalDetected,
    totalIntegrated,
    totalDeferred,
    integrationRate: totalDetected > 0 
      ? Math.round((totalIntegrated / totalDetected) * 100) 
      : 0
  };
}

/**
 * Get tracking data
 */
async function getTrackingData() {
  try {
    const content = await fs.readFile(TRACKING_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return default tracking structure
      return {
        installedVersion: null,
        latestVersion: null,
        lastCheck: null,
        hasUpdate: false,
        versionHistory: [],
        integratedChanges: [],
        deferredChanges: []
      };
    }
    throw error;
  }
}

/**
 * Save tracking data
 */
async function saveTrackingData(data) {
  const dir = path.dirname(TRACKING_FILE);
  await fs.mkdir(dir, { recursive: true });
  
  await fs.writeFile(TRACKING_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  recordUpdate,
  recordIntegration,
  getUpdateHistory,
  getIntegratedChanges,
  getDeferredChanges,
  isChangeIntegrated,
  getIntegrationStats,
  getTrackingData,
  saveTrackingData
};
