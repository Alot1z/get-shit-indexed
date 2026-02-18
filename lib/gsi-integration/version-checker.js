/**
 * GSD Version Checker
 * 
 * Checks npm registry for get-shit-done package updates
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

const TRACKING_FILE = path.join(__dirname, '../../.planning/gsd-integration-tracking.json');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Query npm registry for latest package version
 */
async function getLatestGSDVersion() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'registry.npmjs.org',
      path: '/get-shit-done',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const packageData = JSON.parse(data);
            const latestVersion = packageData['dist-tags']?.latest;
            
            if (latestVersion) {
              resolve(latestVersion);
            } else {
              reject(new Error('No version data in npm response'));
            }
          } else {
            reject(new Error(`npm registry returned ${res.statusCode}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse npm response: ${error.message}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('npm registry request timed out'));
    });

    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Get installed GSD version from tracking file
 */
async function getInstalledGSDVersion() {
  try {
    const content = await fs.readFile(TRACKING_FILE, 'utf-8');
    const tracking = JSON.parse(content);
    return tracking.installedVersion || null;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // Tracking file doesn't exist yet
    }
    throw new Error(`Failed to read tracking file: ${error.message}`);
  }
}

/**
 * Check if update is available (with caching)
 */
async function hasUpdateAvailable() {
  try {
    const tracking = await getTrackingData();
    const now = Date.now();
    
    // Check cache
    if (tracking.lastCheck && (now - tracking.lastCheck < CACHE_TTL)) {
      return {
        cached: true,
        hasUpdate: tracking.hasUpdate || false,
        installedVersion: tracking.installedVersion || null,
        latestVersion: tracking.latestVersion || null
      };
    }
    
    // Fresh check
    const latestVersion = await getLatestGSDVersion();
    const installedVersion = await getInstalledGSDVersion();
    const hasUpdate = installedVersion !== latestVersion;
    
    // Update tracking
    await updateTrackingData({
      lastCheck: now,
      latestVersion,
      installedVersion,
      hasUpdate
    });
    
    return {
      cached: false,
      hasUpdate,
      installedVersion,
      latestVersion
    };
  } catch (error) {
    throw new Error(`Failed to check for updates: ${error.message}`);
  }
}

/**
 * Get tracking data from file
 */
async function getTrackingData() {
  try {
    const content = await fs.readFile(TRACKING_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

/**
 * Update tracking data in file
 */
async function updateTrackingData(updates) {
  try {
    const tracking = await getTrackingData();
    const updated = { ...tracking, ...updates };
    
    // Ensure directory exists
    const dir = path.dirname(TRACKING_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(TRACKING_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to update tracking file: ${error.message}`);
  }
}

module.exports = {
  getLatestGSDVersion,
  getInstalledGSDVersion,
  hasUpdateAvailable,
  getTrackingData,
  updateTrackingData
};
