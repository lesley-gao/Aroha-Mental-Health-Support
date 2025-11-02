/**
 * Crisis resources utilities for Aroha MVP
 * Provides access to NZ mental health crisis hotlines and resources
 */

export interface CrisisResource {
  name: string;
  phone?: string;
  text?: string;
  description: string;
  available: string;
  website?: string;
}

export interface OnlineResource {
  name: string;
  website: string;
  description: string;
}

export interface Resources {
  nz: Record<string, CrisisResource>;
  online: Record<string, OnlineResource>;
}

let cachedResources: Resources | null = null;

/**
 * Load crisis resources from public/resources.json
 * @returns Promise resolving to Resources object
 */
export async function loadResources(): Promise<Resources> {
  if (cachedResources) {
    return cachedResources;
  }

  try {
    const response = await fetch('/resources.json');
    if (!response.ok) {
      throw new Error('Failed to load resources');
    }
    cachedResources = await response.json();
    return cachedResources as Resources;
  } catch (error) {
    console.error('Error loading crisis resources:', error);
    // Return fallback resources if fetch fails
    return getFallbackResources();
  }
}

/**
 * Get emergency crisis resources (highest priority)
 * @returns Array of critical crisis resources
 */
export async function getEmergencyResources(): Promise<CrisisResource[]> {
  const resources = await loadResources();
  return [
    resources.nz.emergency,
    resources.nz.lifeline,
    resources.nz.healthline,
    resources.nz.needToTalk,
  ].filter(Boolean);
}

/**
 * Get all NZ crisis phone resources
 * @returns Array of all NZ crisis resources
 */
export async function getAllNZResources(): Promise<CrisisResource[]> {
  const resources = await loadResources();
  return Object.values(resources.nz);
}

/**
 * Get online mental health resources
 * @returns Array of online resources
 */
export async function getOnlineResources(): Promise<OnlineResource[]> {
  const resources = await loadResources();
  return Object.values(resources.online);
}

/**
 * Format phone number for display (adds spaces)
 * @param phone - Raw phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Handle short codes (e.g., "111", "1737")
  if (phone.length <= 4) {
    return phone;
  }
  
  // Handle 0800 numbers
  if (phone.startsWith('0800')) {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  // Default formatting
  return phone;
}

/**
 * Fallback resources if fetch fails
 * @returns Hardcoded resources object
 */
function getFallbackResources(): Resources {
  return {
    nz: {
      emergency: {
        name: 'Emergency Services',
        phone: '111',
        description: 'For immediate life-threatening emergencies',
        available: '24/7',
      },
      lifeline: {
        name: 'Lifeline Aotearoa',
        phone: '0800 543 354',
        description: 'Free, confidential support for anyone in distress',
        available: '24/7',
        website: 'https://www.lifeline.org.nz',
      },
      healthline: {
        name: 'Healthline',
        phone: '0800 611 116',
        description: 'Free health advice from trained registered nurses',
        available: '24/7',
        website: 'https://www.healthline.govt.nz',
      },
      needToTalk: {
        name: 'Need to Talk?',
        phone: '1737',
        text: '1737',
        description: 'Free call or text to talk with a trained counsellor',
        available: '24/7',
        website: 'https://1737.org.nz',
      },
    },
    online: {
      mentalHealth: {
        name: 'Mental Health Foundation NZ',
        website: 'https://www.mentalhealth.org.nz',
        description: 'Information and resources about mental health and wellbeing',
      },
    },
  };
}

/**
 * Create a tel: link for phone numbers
 * @param phone - Phone number
 * @returns tel: URI
 */
export function createTelLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}

/**
 * Create an sms: link for text numbers
 * @param text - Text number
 * @returns sms: URI
 */
export function createSmsLink(text: string): string {
  return `sms:${text.replace(/\s/g, '')}`;
}
