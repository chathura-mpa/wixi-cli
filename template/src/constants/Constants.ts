import wixConfig from '../../wix.config.json' assert { type: 'json' };

export const _DEV = true
export const APP_ID = wixConfig.appId
export const APP_VERSION = '1.0.0' // TODO: Add your app version. this will only use to identify the version
export const INTERCOM_APP_ID = 'h6dkwybg'
export const APP_NAME = 'Your App Name'// TODO: Add your app name

export const APP_CONSTANTS = {
  baseUrl: 'http://localhost:3000', // TODO: Add your base URL
}

export const API_ENDPOINTS = {
  SETTINGS: APP_CONSTANTS.baseUrl + '/settings',

  // Add your API endpoints here
}

export const GUIDE_JAR_IFRAMES = {
  MAIN_FLOW_URL:
    "",
  PUBLISH_SITE_FLOW_URL:
    "",
};

export const HELP_CENTER_URL =
  "";