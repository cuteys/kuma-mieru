import type { PreloadData } from '@/types/config';
import { ConfigError } from '@/utils/errors';
import JSON5 from 'json5';
import { decodeUnicodeEscapes } from './decoder';
import { validatePreloadData } from './json-sanitizer';

/**
 * 预处理 JSON 字符串，处理常见的非标准格式
 */
export const preprocessJson = (str: string): string => {
  // 移除 JavaScript 变量声明和结尾分号
  let processed = str
    .replace(/^\s*window\.preloadData\s*=\s*/, '')
    .replace(/;?\s*$/, '')
    .trim();

  processed = processed.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, p1) => {
    const unescaped = p1.replace(/\\(['\\])/g, '$1');
    return `"${unescaped.replace(/["\\]/g, '\\$&')}"`;
  });

  return processed;
};

/**
 * 尝试从字符串中提取并解析预加载数据
 */
export const extractPreloadData = (jsonStr: string): PreloadData => {
  // 直接解析尝试
  try {
    const processedJson = preprocessJson(jsonStr);

    if (process.env.NODE_ENV === 'development') {
      console.debug('预处理后的 JSON:', processedJson.slice(0, 100));
    }

    const directParsed = JSON5.parse(processedJson);
    const decodedData = decodeUnicodeEscapes(directParsed); // 新增解码步骤

    if (validatePreloadData(decodedData)) {
      return decodedData;
    }
  } catch (error) {
    console.debug('直接解析失败，尝试其他方法', error);
  }

  // 模式匹配解析
  const patterns = [
    /{[\s\S]*}/,
    /window\.preloadData\s*=\s*({[^;]*});?/,
    /window\.preloadData\s*=\s*({[\s\S]*?})\s*$/,
  ];

  let lastError: Error | null = null;

  for (const pattern of patterns) {
    const match = jsonStr.match(pattern);
    if (match) {
      try {
        const jsonData = preprocessJson(match[1] || match[0]);
        console.debug(`尝试使用模式 ${pattern} 解析数据:`, jsonData.slice(0, 100));

        const parsed = JSON5.parse(jsonData);
        const decoded = decodeUnicodeEscapes(parsed); // 新增解码步骤

        if (validatePreloadData(decoded)) {
          console.debug('成功解析数据');
          return decoded;
        }
      } catch (error) {
        console.debug(`使用模式 ${pattern} 解析失败:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw new ConfigError(
    `无法从脚本中提取预加载数据: ${lastError?.message || '未知错误'}\n` +
      `清理后的数据: ${jsonStr.slice(0, 200)}...`,
  );
};
