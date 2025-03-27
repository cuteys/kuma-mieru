import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { z } from 'zod';
import { extractPreloadData } from '../utils/json-processor';
import { sanitizeJsonString } from '../utils/json-sanitizer';

const siteMetaSchema = z.object({
  title: z.string().default('Kuma Mieru'),
  description: z.string().default('A beautiful and modern uptime monitoring dashboard'),
  icon: z.string().default('/favicon.svg'),
});

const configSchema = z.object({
  baseUrl: z.string().url(),
  pageId: z.string(),
  siteMeta: siteMetaSchema,
  isPlaceholder: z.boolean().default(false),
  isEditThisPage: z.boolean().default(true),
  isShowStarButton: z.boolean().default(true),
});

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function getBooleanEnvVar(name: string, defaultValue = true): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

async function fetchSiteMeta(baseUrl: string, pageId: string) {
  try {
    const response = await fetch(`${baseUrl}/status/${pageId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch site meta: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const preloadScript = $('#preload-data').text();

    if (!preloadScript) {
      throw new Error('Preload data script tag not found');
    }

    const jsonStr = sanitizeJsonString(preloadScript);
    const preloadData = extractPreloadData(jsonStr);

    return siteMetaSchema.parse({
      title: preloadData.config.title || undefined, // 触发 zod 默认值
      description: preloadData.config.description || undefined,
      icon: preloadData.config.icon || undefined,
    });
  } catch (error) {
    console.error('Error fetching site meta:', error);
    return siteMetaSchema.parse({});
  }
}

async function generateConfig() {
  try {
    const baseUrl = getRequiredEnvVar('UPTIME_KUMA_BASE_URL');
    const pageId = getRequiredEnvVar('PAGE_ID');

    // 获取并验证配置项
    try {
      new URL(baseUrl);
    } catch {
      throw new Error('UPTIME_KUMA_BASE_URL must be a valid URL');
    }

    const isEditThisPage = getBooleanEnvVar('FEATURE_EDIT_THIS_PAGE');
    const isShowStarButton = getBooleanEnvVar('FEATURE_SHOW_STAR_BUTTON');
    const siteMeta = await fetchSiteMeta(baseUrl, pageId);

    const config = configSchema.parse({
      baseUrl,
      pageId,
      siteMeta,
      isPlaceholder: false,
      isEditThisPage,
      isShowStarButton,
    });

    const configPath = path.join(process.cwd(), 'config', 'generated-config.json');

    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    console.log('✅ Configuration file generated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error generating configuration file:', error.message);
    } else {
      console.error('❌ Unknown error generating configuration file');
    }
    process.exit(1);
  }
}

generateConfig().catch(console.error);
