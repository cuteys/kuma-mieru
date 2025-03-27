type DeepRecord = { [key: string]: DeepRecord | unknown };

/**
 * 递归解码对象中所有字符串的转义序列
 * @param value - 需要解码的值
 * @returns 解码后的值
 */
function decodeUnicodeEscapes(value: unknown): unknown {
  // 字符串类型处理转义序列
  if (typeof value === 'string') {
    return (
      value
        // 先处理常见转义字符
        .replace(
          /\\([nrt\\])/g,
          (_, char: string) =>
            (
              ({
                n: '\n',
                r: '\r',
                t: '\t',
                '\\': '\\',
              }) as Record<string, string>
            )[char] || char,
        )
        // 再处理 Unicode 转义序列
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    );
  }

  // 数组类型递归处理每个元素
  if (Array.isArray(value)) {
    return value.map(decodeUnicodeEscapes);
  }

  // 对象类型递归处理每个属性
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as DeepRecord).map(([k, v]) => [k, decodeUnicodeEscapes(v)]),
    );
  }

  // 其他类型直接返回
  return value;
}

export { decodeUnicodeEscapes };
