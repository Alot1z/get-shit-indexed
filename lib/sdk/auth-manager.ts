/**
 * Authentication Manager
 * 
 * Handles secure credential storage and multi-account support for GSI SDK.
 * 
 * @module gsi/sdk/auth-manager
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

// Authentication configuration
export interface AuthConfig {
  /** Credential storage path */
  storagePath?: string;
  /** Enable encryption for stored credentials */
  encryptCredentials?: boolean;
  /** Auto-refresh tokens before expiry */
  autoRefresh?: boolean;
  /** Refresh threshold in seconds before expiry */
  refreshThreshold?: number;
}

// Credentials
export interface Credentials {
  /** API key */
  apiKey: string;
  /** Optional account identifier */
  accountId?: string;
  /** Optional organization ID */
  organizationId?: string;
  /** Token expiry time (ISO string) */
  expiresAt?: string;
  /** Refresh token */
  refreshToken?: string;
  /** Provider type */
  provider: 'anthropic' | 'zai' | 'custom';
  /** Account name for display */
  displayName?: string;
  /** When credentials were stored */
  storedAt: string;
}

// Stored credentials (encrypted)
interface StoredCredentials {
  encrypted: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

/**
 * Authentication Manager
 * 
 * Manages secure credential storage with encryption.
 */
export class AuthManager extends EventEmitter {
  private config: Required<AuthConfig>;
  private credentials: Map<string, Credentials> = new Map();
  private activeAccount: string | null = null;
  private encryptionKey: Buffer | null = null;

  constructor(config: AuthConfig = {}) {
    super();
    this.config = {
      storagePath: config.storagePath ?? this.getDefaultStoragePath(),
      encryptCredentials: config.encryptCredentials ?? true,
      autoRefresh: config.autoRefresh ?? true,
      refreshThreshold: config.refreshThreshold ?? 300, // 5 minutes
    };

    this.initializeEncryptionKey();
    this.loadCredentials();
  }

  /**
   * Get default storage path
   */
  private getDefaultStoragePath(): string {
    return path.join(os.homedir(), '.gsi', 'credentials.json');
  }

  /**
   * Initialize encryption key from machine ID
   */
  private initializeEncryptionKey(): void {
    // Create a machine-specific key for encryption
    const machineId = this.getMachineId();
    this.encryptionKey = crypto.createHash('sha256')
      .update(machineId)
      .digest();
  }

  /**
   * Get machine-specific identifier
   */
  private getMachineId(): string {
    const hostname = os.hostname();
    const platform = os.platform();
    const homedir = os.homedir();
    return `${hostname}-${platform}-${homedir}`;
  }

  /**
   * Load credentials from storage
   */
  private loadCredentials(): void {
    try {
      if (!fs.existsSync(this.config.storagePath)) {
        return;
      }

      const data = fs.readFileSync(this.config.storagePath, 'utf-8');
      const stored = JSON.parse(data);

      for (const [account, credData] of Object.entries(stored.credentials || {})) {
        if (this.config.encryptCredentials) {
          const decrypted = this.decryptCredentials(credData as StoredCredentials);
          if (decrypted) {
            this.credentials.set(account, decrypted);
          }
        } else {
          this.credentials.set(account, credData as Credentials);
        }
      }

      this.activeAccount = stored.activeAccount || null;
    } catch (error) {
      this.emit('error', {
        type: 'load',
        message: error instanceof Error ? error.message : 'Failed to load credentials',
      });
    }
  }

  /**
   * Save credentials to storage
   */
  private saveCredentials(): void {
    try {
      const storageDir = path.dirname(this.config.storagePath);
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }

      const toStore: Record<string, StoredCredentials | Credentials> = {};

      for (const [account, creds] of this.credentials) {
        if (this.config.encryptCredentials) {
          toStore[account] = this.encryptCredentials(creds);
        } else {
          toStore[account] = creds;
        }
      }

      const data = {
        version: 1,
        activeAccount: this.activeAccount,
        credentials: toStore,
      };

      fs.writeFileSync(
        this.config.storagePath,
        JSON.stringify(data, null, 2),
        { mode: 0o600 } // Restrict permissions
      );

      this.emit('saved', { accountCount: this.credentials.size });
    } catch (error) {
      this.emit('error', {
        type: 'save',
        message: error instanceof Error ? error.message : 'Failed to save credentials',
      });
    }
  }

  /**
   * Encrypt credentials
   */
  private encryptCredentials(creds: Credentials): StoredCredentials {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, this.encryptionKey, iv);

    let encrypted = cipher.update(JSON.stringify(creds), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm,
    };
  }

  /**
   * Decrypt credentials
   */
  private decryptCredentials(stored: StoredCredentials): Credentials | null {
    if (!this.encryptionKey) {
      return null;
    }

    try {
      const algorithm = stored.algorithm || 'aes-256-gcm';
      const iv = Buffer.from(stored.iv, 'hex');
      const authTag = Buffer.from(stored.authTag, 'hex');

      const decipher = crypto.createDecipheriv(algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(stored.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch {
      this.emit('error', {
        type: 'decrypt',
        message: 'Failed to decrypt credentials',
      });
      return null;
    }
  }

  /**
   * Store credentials for an account
   */
  setCredentials(account: string, creds: Omit<Credentials, 'storedAt'>): void {
    const fullCreds: Credentials = {
      ...creds,
      storedAt: new Date().toISOString(),
    };

    this.credentials.set(account, fullCreds);

    if (!this.activeAccount) {
      this.activeAccount = account;
    }

    this.saveCredentials();
    this.emit('credentialsSet', { account, provider: creds.provider });
  }

  /**
   * Get credentials for an account
   */
  getCredentials(account?: string): Credentials | null {
    const targetAccount = account || this.activeAccount;
    if (!targetAccount) {
      return null;
    }
    return this.credentials.get(targetAccount) || null;
  }

  /**
   * Get API key for an account
   */
  getApiKey(account?: string): string | null {
    const creds = this.getCredentials(account);
    return creds?.apiKey || null;
  }

  /**
   * Set active account
   */
  setActiveAccount(account: string): boolean {
    if (!this.credentials.has(account)) {
      return false;
    }

    this.activeAccount = account;
    this.saveCredentials();
    this.emit('activeAccountChanged', { account });
    return true;
  }

  /**
   * Get active account name
   */
  getActiveAccount(): string | null {
    return this.activeAccount;
  }

  /**
   * List all accounts
   */
  listAccounts(): Array<{
    account: string;
    provider: string;
    displayName?: string;
    storedAt: string;
  }> {
    return Array.from(this.credentials.entries()).map(([account, creds]) => ({
      account,
      provider: creds.provider,
      displayName: creds.displayName,
      storedAt: creds.storedAt,
    }));
  }

  /**
   * Remove credentials for an account
   */
  removeAccount(account: string): boolean {
    if (!this.credentials.has(account)) {
      return false;
    }

    this.credentials.delete(account);

    if (this.activeAccount === account) {
      this.activeAccount = this.credentials.keys().next().value || null;
    }

    this.saveCredentials();
    this.emit('accountRemoved', { account });
    return true;
  }

  /**
   * Check if credentials are expired
   */
  isExpired(account?: string): boolean {
    const creds = this.getCredentials(account);
    if (!creds || !creds.expiresAt) {
      return false;
    }

    return new Date(creds.expiresAt) < new Date();
  }

  /**
   * Check if credentials need refresh
   */
  needsRefresh(account?: string): boolean {
    const creds = this.getCredentials(account);
    if (!creds || !creds.expiresAt) {
      return false;
    }

    const expiry = new Date(creds.expiresAt).getTime();
    const threshold = this.config.refreshThreshold * 1000;
    return expiry - Date.now() < threshold;
  }

  /**
   * Refresh credentials (placeholder - would call refresh endpoint)
   */
  async refreshCredentials(account?: string): Promise<boolean> {
    const creds = this.getCredentials(account);
    if (!creds || !creds.refreshToken) {
      return false;
    }

    // In a real implementation, this would call the provider's refresh endpoint
    this.emit('refreshAttempt', { account: account || this.activeAccount });
    return false;
  }

  /**
   * Clear all credentials
   */
  clearAll(): void {
    this.credentials.clear();
    this.activeAccount = null;

    try {
      if (fs.existsSync(this.config.storagePath)) {
        fs.unlinkSync(this.config.storagePath);
      }
    } catch {
      // Ignore errors
    }

    this.emit('cleared');
  }
}

// Singleton instance
let defaultManager: AuthManager | null = null;

/**
 * Get the default auth manager
 */
export function getAuthManager(): AuthManager {
  if (!defaultManager) {
    defaultManager = new AuthManager();
  }
  return defaultManager;
}
