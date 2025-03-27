import type { Config } from '@/types/config';
import { env } from './env';

export const getConfig = (): Config => {
  const { baseUrl, pageId, siteMeta, isEditThisPage, isShowStarButton } = env.config;
  const { NODE_ENV } = env.runtime;

  if (!baseUrl || !pageId) {
    throw new Error('Missing required configuration variables');
  }

  const config = {
    baseUrl,
    pageId,
    htmlEndpoint: `${baseUrl}/status/${pageId}`,
    apiEndpoint: `${baseUrl}/api/status-page/heartbeat/${pageId}`,
    siteMeta,
    isPlaceholder: false,
    isEditThisPage,
    isShowStarButton,
  };

  if (NODE_ENV === 'development') {
    console.log('config', config);
  }

  return config;
};

export const apiConfig = getConfig();

export type ApiConfig = Config;

export const validateConfig = () => {
  return true;
};
