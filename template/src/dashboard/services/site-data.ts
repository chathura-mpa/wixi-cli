import { appInstances } from '@wix/app-management';
import { siteProperties } from '@wix/business-tools';
import { httpClient } from '@wix/essentials';

import { API_ENDPOINTS, APP_CONSTANTS } from '../../constants';
import ApiClient from '../utils/api-client';

const DEFAULT_LOCALE = {
  country: 'US',
  languageCode: 'en'
};

export const getWixSiteData = async () => {
  const { instance, site } = await appInstances.getAppInstance();
  const { properties } = await fetchSiteProperties();

  const { country, languageCode } = properties?.locale ?? DEFAULT_LOCALE;
  const billingPlan = instance?.billing?.packageName ?? 'Free';

  return {
    instanceId: instance?.instanceId ?? '',
    currency: site?.paymentCurrency ?? '',
    locale: `${languageCode}-${country}`,
    email: site?.ownerInfo?.email ?? properties?.email ?? '',
    siteDisplayName: site?.siteDisplayName ?? '',
    siteUrl: site?.url ?? '',
    subscriptionPlan: billingPlan
  };
};

const fetchSiteProperties = async (): Promise<{ properties: Record<string, any> }> => {
  try {
    const response = await siteProperties.getSiteProperties();
    return { properties: response.properties ?? {} };
  } catch (primaryError) {
    console.warn('Primary siteProperties call failed, using fallback.', primaryError);

    try {
      const response = await httpClient.fetchWithAuth(
        'https://www.wixapis.com/site-properties/v4/properties',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`Fallback failed: ${response.status}`);
      }

      return await response.json();
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  }

  return { properties: {} };
};

export const updateInstance = async () => {
  const { instance } = await appInstances.getAppInstance();
  const url = `${APP_CONSTANTS.baseUrl}/updateInstance?instanceId=${instance?.instanceId}`;

  return await ApiClient.request(url, 'POST', null, false);
};

export const requestFetchSettings = async () => {
  return await ApiClient.request(API_ENDPOINTS.SETTINGS, 'GET', null, true);
};

export const requestSetSettings = async (body: Partial<object>) => {
  return await ApiClient.request(
    API_ENDPOINTS.SETTINGS,
    'POST',
    body as Record<string, unknown>,
    true
  );
};

export const requestUpdateSetSettings = async (body: Partial<object>) => {
  return await ApiClient.request(
    API_ENDPOINTS.SETTINGS,
    'PATCH',
    body as Record<string, unknown>,
    true
  );
};