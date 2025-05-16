
// No answer modes needed - using a single unified mode

const DEFAULT_SETTINGS = {};

interface AppSettings {
  // Settings can be added here in the future if needed
}


let currentSettings: AppSettings = { ...DEFAULT_SETTINGS };


export function getSettings(): AppSettings {
  return { ...currentSettings };
}


export function updateSettings(newSettings: Partial<AppSettings>): AppSettings {
  currentSettings = {
    ...currentSettings,
    ...newSettings
  };


  if (typeof window !== 'undefined') {
    localStorage.setItem('snapSyncSettings', JSON.stringify(currentSettings));
  }

  return { ...currentSettings };
}


export function initializeSettings(): void {
  if (typeof window !== 'undefined') {
    const savedSettings = localStorage.getItem('snapSyncSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        currentSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed
        };
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }
}
