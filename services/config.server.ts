import { apiConfig } from '@/config/api';
import type { GlobalConfig } from '@/types/config';
import { ConfigError } from '@/utils/errors';
import { extractPreloadData } from '@/utils/json-processor';
import { sanitizeJsonString } from '@/utils/json-sanitizer';
import * as cheerio from 'cheerio';
import { cache } from 'react';
import { customFetchOptions, ensureUTCTimezone } from './utils/common';
import { customFetch } from './utils/fetch';

export const getGlobalConfig = cache(async (): Promise<GlobalConfig> => {
  try {
    const preloadData = await getPreloadData();

    if (!preloadData.config) {
      throw new ConfigError('Configuration data is missing');
    }

    const requiredFields = ['slug', 'title', 'description', 'icon', 'theme'];

    for (const field of requiredFields) {
      if (!(field in preloadData.config)) {
        throw new ConfigError(`Configuration is missing required field: ${field}`);
      }
    }

    if (typeof preloadData.config.theme !== 'string') {
      throw new ConfigError('Theme must be a string');
    }

    const theme =
      preloadData.config.theme === 'dark'
        ? 'dark'
        : preloadData.config.theme === 'light'
          ? 'light'
          : 'system';

    const config: GlobalConfig = {
      config: {
        ...preloadData.config,
        theme,
      },
      incident: preloadData.incident
        ? {
            ...preloadData.incident,
            createdDate: ensureUTCTimezone(preloadData.incident.createdDate),
            lastUpdatedDate: ensureUTCTimezone(preloadData.incident.lastUpdatedDate),
          }
        : undefined,
    };

    return config;
  } catch (error) {
    console.error(
      'Failed to get configuration data:',
      error instanceof ConfigError ? error.message : 'Unknown error',
      error,
    );

    return {
      config: {
        slug: '',
        title: '',
        description: '',
        icon: '/favicon.svg',
        theme: 'system',
        published: true,
        showTags: true,
        customCSS: '',
        footerText: '',
        showPoweredBy: false,
        googleAnalyticsId: null,
        showCertificateExpiry: false,
      },
    };
  }
});

export async function getPreloadData() {
  try {
    const htmlResponse = await customFetch(apiConfig.htmlEndpoint, customFetchOptions);

    if (!htmlResponse.ok) {
      throw new ConfigError(
        `Failed to get HTML: ${htmlResponse.status} ${htmlResponse.statusText}`,
      );
    }

    const html = await htmlResponse.text();
    const $ = cheerio.load(html);
    const preloadScript = $('#preload-data').text();

    if (!preloadScript) {
      throw new ConfigError('Preload script tag not found');
    }

    try {
      const jsonStr = sanitizeJsonString(preloadScript);
      return extractPreloadData(jsonStr);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ConfigError(
          `JSON parsing failed: ${error.message}\nProcessed data: ${preloadScript.slice(0, 100)}...`,
          error,
        );
      }
      if (error instanceof ConfigError) {
        throw error;
      }
      throw new ConfigError(
        `Failed to parse preload data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
    }
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    // 添加更详细的错误日志
    console.error('Failed to get preload data:', {
      endpoint: apiConfig.htmlEndpoint,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
              cause: error.cause,
            }
          : error,
    });
    throw new ConfigError(
      'Failed to get preload data, please check network connection and server status',
    );
  }
}
