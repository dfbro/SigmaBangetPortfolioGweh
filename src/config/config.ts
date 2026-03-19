interface GHConfig {
  OWNER: string;
  REPO: string;
  TOKEN: string;
  Release_Tag: string;
}

interface AppConfig {
  GH: GHConfig;
}

export function getGHConfig(): GHConfig {
  return {
    OWNER: process.env.GH_OWNER?.trim() ?? '',
    REPO: process.env.GH_REPO?.trim() ?? '',
    TOKEN: process.env.GH_TOKEN?.trim() ?? '',
    Release_Tag: process.env.GH_RELEASE_TAG?.trim() || 'cfw-storage',
  };
}

const APP_CONFIG: AppConfig = {
  GH: getGHConfig(),
} as const;

export const GH_CONFIG = {
  get OWNER() {
    return getGHConfig().OWNER;
  },
  get REPO() {
    return getGHConfig().REPO;
  },
  get TOKEN() {
    return getGHConfig().TOKEN;
  },
  get Release_Tag() {
    return getGHConfig().Release_Tag;
  },
};

export function validateGHConfig(config: GHConfig = GH_CONFIG): GHConfig {
  if (!config.OWNER || !config.REPO || !config.TOKEN || !config.Release_Tag) {
    throw new Error(
      'GitHub storage is not configured. Set GH_OWNER, GH_REPO, GH_TOKEN, and GH_RELEASE_TAG.'
    );
  }

  return config;
}

export default APP_CONFIG;
