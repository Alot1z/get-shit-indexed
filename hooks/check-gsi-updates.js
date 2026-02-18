/**
 * Check GSD Updates Hook
 * 
 * Scheduled check for get-shit-done npm updates
 * Run via gsi-statusline or cron/scheduler
 */

const path = require('path');
const { hasUpdateAvailable } = require('../lib/gsi-integration/version-checker');
const fs = require('fs').promises;

const TRACKING_FILE = path.join(__dirname, '../.planning/gsd-integration-tracking.json');

/**
 * Check for GSD updates and display notification
 */
async function checkGSDUpdates(options = {}) {
  const {
    silent = false,
    force = false,
    notify = true
  } = options;

  try {
    const tracking = await getTrackingData();
    const now = Date.now();
    const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

    // Check if enough time has passed (unless forced)
    if (!force && tracking.lastCheck) {
      const timeSinceLastCheck = now - tracking.lastCheck;
      if (timeSinceLastCheck < CHECK_INTERVAL) {
        if (!silent) {
          const hoursUntilNext = Math.ceil((CHECK_INTERVAL - timeSinceLastCheck) / (60 * 60 * 1000));
          console.log(`GSD update check: already checked recently (${hoursUntilNext}h until next check)`);
        }
        return { checked: false, reason: 'too_soon' };
      }
    }

    // Perform check
    const updateInfo = await hasUpdateAvailable();

    if (updateInfo.hasUpdate && notify) {
      // Display notification
      const notification = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔄 GSD Update Available!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Current: ${updateInfo.installedVersion || 'unknown'}
  Latest:  ${updateInfo.latestVersion}

  Run 'gsi check-gsd-updates' for details
  Run 'gsi gsd-update-history' for past updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
      console.log(notification);
    } else if (!silent) {
      console.log(`GSD update check: no updates available (${updateInfo.latestVersion})`);
    }

    return {
      checked: true,
      hasUpdate: updateInfo.hasUpdate,
      installedVersion: updateInfo.installedVersion,
      latestVersion: updateInfo.latestVersion,
      cached: updateInfo.cached
    };

  } catch (error) {
    if (!silent) {
      console.error(`GSD update check failed: ${error.message}`);
    }
    return { checked: false, error: error.message };
  }
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
      return {};
    }
    throw error;
  }
}

/**
 * Configure check frequency
 */
async function configureCheckFrequency(hours = 24) {
  const tracking = await getTrackingData();
  tracking.checkIntervalHours = hours;
  await saveTrackingData(tracking);
  console.log(`GSD update check frequency set to ${hours} hours`);
}

/**
 * Save tracking data
 */
async function saveTrackingData(data) {
  const dir = path.dirname(TRACKING_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(TRACKING_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    silent: args.includes('--silent'),
    force: args.includes('--force'),
    notify: !args.includes('--no-notify')
  };

  // Check for configure command
  const configIndex = args.indexOf('--configure');
  if (configIndex !== -1) {
    const hours = parseInt(args[configIndex + 1], 10) || 24;
    configureCheckFrequency(hours);
  } else {
    checkGSDUpdates(options);
  }
}

module.exports = {
  checkGSDUpdates,
  configureCheckFrequency
};
