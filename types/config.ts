import type { GeneratedConfig } from '@/config/types';
import type { Incident, MonitorGroup } from './monitor';

export interface Config extends GeneratedConfig {
  htmlEndpoint: string;
  apiEndpoint: string;
}

export interface SiteConfig {
  slug: string;
  title: string;
  description: string;
  icon: string;
  theme: 'light' | 'dark' | 'system';
  published: boolean;
  showTags: boolean;
  customCSS: string;
  footerText: string;
  showPoweredBy: boolean;
  googleAnalyticsId: string | null;
  showCertificateExpiry: boolean;
}

export interface GlobalConfig {
  config: SiteConfig;
  incident?: Incident;
}

/**
 * 预加载数据接口
 */
export interface PreloadData {
  config: {
    slug: string;
    title: string;
    description: string;
    icon: string;
    theme: string;
    published: boolean;
    // 是否显示节点标签
    showTags: boolean;
    // 是否显示自定义 CSS, 由于是 SSR，所以没啥用
    customCSS: string;
    // 页脚文本
    footerText: string;
    // 是否显示 Powered by 信息
    showPoweredBy: boolean;
    // 是否显示 Google Analytics
    googleAnalyticsId: string | null;
    // 是否显示证书过期信息
    showCertificateExpiry: boolean;
  };

  // 监控组
  publicGroupList: MonitorGroup[];

  // 暂时没搞明白这个字段的作用
  maintenanceList: [];

  // 维护信息
  incident?: Incident;
}
