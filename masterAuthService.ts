/**
 * Master CEO Security & Authentication Service
 * Implements SHA-256 cryptographic hashing via Web Crypto API.
 * Ensures the Master account is securely initialized, locked after first creation,
 * and authenticated strictly before granting administrative privileges.
 */

export interface MasterProfile {
  name: string;
  cpf: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
}

export interface PlatformConfig {
  platformCommissionPercent: number; // e.g. 10%
  coverageRadiusKm: number; // e.g. 35 km
  noShowFee: number; // e.g. R$ 10.00
  supportPhone: string; // e.g. (83) 99888-7700
  pixKeyMaster: string; // e.g. wdriveroficial@gmail.com
  allowAutoDispatch: boolean;
}

const STORAGE_MASTER_KEY = 'wdriver_master_ceo_credential_v2';
const STORAGE_SESSION_KEY = 'wdriver_master_ceo_session_v2';
const STORAGE_CONFIG_KEY = 'wdriver_master_platform_config_v2';
const STORAGE_DRIVER_STATUS_KEY = 'wdriver_driver_status_map_v2';

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  platformCommissionPercent: 10,
  coverageRadiusKm: 35,
  noShowFee: 10.0,
  supportPhone: '(83) 99888-7700',
  pixKeyMaster: 'wdriveroficial@gmail.com',
  allowAutoDispatch: true,
};

/**
 * Computes a secure SHA-256 hash using the native browser Web Crypto API.
 * The plain password is never stored or transmitted in clear text.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if the Master CEO account is already registered.
 */
export function isMasterAccountRegistered(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_MASTER_KEY);
    return !!raw && JSON.parse(raw).passwordHash?.length > 0;
  } catch {
    return false;
  }
}

/**
 * Gets the registered Master profile (without sensitive details).
 */
export function getRegisteredMasterInfo(): { name: string; cpfMasked: string; createdAt: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_MASTER_KEY);
    if (!raw) return null;
    const profile: MasterProfile = JSON.parse(raw);
    const cleanCpf = profile.cpf.replace(/\D/g, '');
    const cpfMasked = cleanCpf.length === 11
      ? `***.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-**`
      : '***.***.***-**';
    return {
      name: profile.name,
      cpfMasked,
      createdAt: profile.createdAt,
    };
  } catch {
    return null;
  }
}

/**
 * Registers the initial Master CEO account (First Access / Onboarding).
 * Once created, subsequent creations are permanently blocked.
 */
export async function registerInitialMaster(
  name: string,
  cpf: string,
  plainPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (isMasterAccountRegistered()) {
    return {
      success: false,
      error: 'O perfil Master CEO já foi registrado e está permanentemente bloqueado para novos cadastros.',
    };
  }

  if (!name.trim() || name.trim().length < 3) {
    return { success: false, error: 'Por favor, informe seu Nome Completo válido.' };
  }

  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11) {
    return { success: false, error: 'CPF inválido. Certifique-se de digitar os 11 dígitos.' };
  }

  if (!plainPassword || plainPassword.length < 6) {
    return { success: false, error: 'A senha de segurança deve conter no mínimo 6 caracteres.' };
  }

  const passwordHash = await sha256(plainPassword);
  const profile: MasterProfile = {
    name: name.trim(),
    cpf: cleanCpf,
    passwordHash,
    createdAt: new Date().toLocaleDateString('pt-BR'),
  };

  localStorage.setItem(STORAGE_MASTER_KEY, JSON.stringify(profile));
  // Auto-authenticate upon initial onboarding
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({ token: passwordHash, timestamp: Date.now() }));

  return { success: true };
}

/**
 * Authenticates the Master CEO by validating CPF and SHA-256 password hash.
 */
export async function authenticateMaster(
  cpf: string,
  plainPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_MASTER_KEY);
    if (!raw) {
      return { success: false, error: 'Nenhum perfil Master CEO cadastrado. Realize o primeiro acesso.' };
    }

    const profile: MasterProfile = JSON.parse(raw);
    const cleanCpf = cpf.replace(/\D/g, '');
    const cleanSavedCpf = profile.cpf.replace(/\D/g, '');

    if (cleanCpf !== cleanSavedCpf) {
      return { success: false, error: 'CPF do Master incorreto ou não correspondente.' };
    }

    const passwordHash = await sha256(plainPassword);
    if (passwordHash !== profile.passwordHash) {
      return { success: false, error: 'Senha incorreta. Acesso restrito ao Administrador Geral.' };
    }

    // Update last login
    profile.lastLogin = new Date().toLocaleTimeString('pt-BR');
    localStorage.setItem(STORAGE_MASTER_KEY, JSON.stringify(profile));

    // Save active session token
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({ token: passwordHash, timestamp: Date.now() }));

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Falha durante a autenticação de segurança.' };
  }
}

/**
 * Checks if current active Master CEO session is valid.
 */
export function isMasterSessionActive(): boolean {
  try {
    const rawMaster = localStorage.getItem(STORAGE_MASTER_KEY);
    const rawSession = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!rawMaster || !rawSession) return false;

    const profile: MasterProfile = JSON.parse(rawMaster);
    const session = JSON.parse(rawSession);

    // Session valid for 12 hours
    const isExpired = Date.now() - session.timestamp > 12 * 60 * 60 * 1000;
    if (isExpired) {
      logoutMaster();
      return false;
    }

    return session.token === profile.passwordHash;
  } catch {
    return false;
  }
}

/**
 * Logs out the Master CEO and removes the active session token.
 */
export function logoutMaster(): void {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch {
    // ignore
  }
}

/**
 * Platform Config Management
 */
export function getPlatformConfig(): PlatformConfig {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) return { ...DEFAULT_PLATFORM_CONFIG, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_PLATFORM_CONFIG;
}

export function savePlatformConfig(config: PlatformConfig): void {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Driver Status Map (Active, Suspended, Banned)
 */
export type DriverAccountStatus = 'active' | 'suspended' | 'banned';

export function getDriverStatusMap(): Record<string, DriverAccountStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_DRIVER_STATUS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {};
}

export function setDriverAccountStatus(driverId: string, status: DriverAccountStatus): void {
  try {
    const current = getDriverStatusMap();
    current[driverId] = status;
    localStorage.setItem(STORAGE_DRIVER_STATUS_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}
