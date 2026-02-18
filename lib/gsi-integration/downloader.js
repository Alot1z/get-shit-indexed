/**
 * GSD Package Downloader
 * 
 * Downloads get-shit-done npm package for analysis
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createWriteStream, createReadStream } = require('fs');
const { pipeline } = require('stream/promises');
const { createReadStream: createReadStreamTar, extract } = require('tar');

const TEMP_DIR = path.join(__dirname, '../../.temp/gsd-downloads');

/**
 * Download GSD package tarball from npm
 */
async function downloadGSDPackage(version) {
  const tarballUrl = `https://registry.npmjs.org/get-shit-done/-/get-shit-done-${version}.tgz`;
  const tempDir = path.join(TEMP_DIR, `get-shit-done-${version}`);
  const tarballPath = path.join(TEMP_DIR, `get-shit-done-${version}.tgz`);
  
  try {
    // Ensure temp directory exists
    await fs.mkdir(TEMP_DIR, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });
    
    // Download tarball
    await downloadFile(tarballUrl, tarballPath);
    
    // Extract tarball
    await extractTarball(tarballPath, tempDir);
    
    // Return package directory (inside tarball: package/)
    const packageDir = path.join(tempDir, 'package');
    
    return {
      version,
      packageDir,
      tarballPath,
      tempDir
    };
  } catch (error) {
    // Cleanup on failure
    await cleanupDownload(tempDir);
    await fs.unlink(tarballPath).catch(() => {});
    throw new Error(`Failed to download package: ${error.message}`);
  }
}

/**
 * Download file from URL
 */
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;
      
      response.pipe(file);
      
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize) {
          const progress = Math.round((downloadedSize / totalSize) * 100);
          process.stderr.write(`\rDownloading: ${progress}%`);
        }
      });
      
      file.on('finish', () => {
        file.close();
        process.stderr.write('\r');
        resolve();
      });
      
      file.on('error', (error) => {
        fs.unlink(destPath).catch(() => {});
        reject(error);
      });
    }).on('error', (error) => {
      file.close();
      fs.unlink(destPath).catch(() => {});
      reject(new Error(`Network error: ${error.message}`));
    });
  });
}

/**
 * Extract tarball to directory
 */
async function extractTarball(tarballPath, destPath) {
  try {
    await pipeline(
      createReadStreamTar(tarballPath),
      extract({ cwd: destPath, strip: 0 })
    );
  } catch (error) {
    throw new Error(`Failed to extract tarball: ${error.message}`);
  }
}

/**
 * Clean up downloaded package
 */
async function cleanupDownload(tempDir) {
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Non-critical, log but don't throw
    console.warn(`Warning: Failed to cleanup temp directory: ${error.message}`);
  }
}

/**
 * Clean up all temp downloads
 */
async function cleanupAllDownloads() {
  try {
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  } catch (error) {
    console.warn(`Warning: Failed to cleanup all downloads: ${error.message}`);
  }
}

module.exports = {
  downloadGSDPackage,
  cleanupDownload,
  cleanupAllDownloads
};
