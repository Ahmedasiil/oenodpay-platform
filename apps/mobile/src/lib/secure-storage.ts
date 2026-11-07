import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * The refresh token lives in the iOS Keychain / Android Keystore, readable only by this app
 * on this device, only after the phone is unlocked, and never included in backups.
 * In a web browser it stays in memory only (the website uses secure cookies instead).
 */
const memory = new Map<string, string>();
const native = Platform.OS === 'ios' || Platform.OS === 'android';
const options: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export async function secureGet(key: string): Promise<string | null> {
  return native ? SecureStore.getItemAsync(key, options) : memory.get(key) ?? null;
}

export async function secureSet(key: string, value: string): Promise<void> {
  if (native) await SecureStore.setItemAsync(key, value, options);
  else memory.set(key, value);
}

export async function secureDelete(key: string): Promise<void> {
  if (native) await SecureStore.deleteItemAsync(key, options);
  else memory.delete(key);
}
