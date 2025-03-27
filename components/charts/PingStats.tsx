import type { Heartbeat } from '@/types/monitor';
import { Tooltip } from '@heroui/react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { calculatePingMetrics } from '../utils/charts';
import { getPingColorClass } from '../utils/colors';
import { formatLatency } from '../utils/format';

interface PingStatsProps {
  heartbeats: Heartbeat[];
  isHome?: boolean;
}

const PING_LABELS = {
  lt: {
    short: 'LT',
    full: 'nodeLatestPing',
  },
  av: {
    short: 'AVG',
    full: 'nodeAvgPing',
  },
  ta: {
    short: 'TA',
    full: 'nodeTrimmedAvgPing',
  },
} as const;

interface SinglePingStatProps {
  label: (typeof PING_LABELS)[keyof typeof PING_LABELS];
  value: number;
  isHome?: boolean;
  t: ReturnType<typeof useTranslations>;
}

const SinglePingStat = ({ label, value, isHome, t }: SinglePingStatProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {isHome ? (
        <Tooltip content={t(label.full)}>
          <span>{label.short}</span>
        </Tooltip>
      ) : (
        t(label.full)
      )}
      :
      <span className={clsx('font-medium', getPingColorClass(value).text)}>
        {formatLatency(value)}
      </span>
    </div>
  );
};

export function PingStats({ heartbeats, isHome = false }: PingStatsProps) {
  const t = useTranslations();
  const stats = useMemo(() => calculatePingMetrics(heartbeats), [heartbeats]);

  if (!stats) return null;

  return (
    <div className="flex hide-ping-stats items-center gap-1.5 text-xs text-foreground/80 dark:text-foreground/60">
      <SinglePingStat label={PING_LABELS.lt} value={stats.latestPing} isHome={isHome} t={t} />
      <SinglePingStat label={PING_LABELS.av} value={stats.avgPing} isHome={isHome} t={t} />
      <SinglePingStat label={PING_LABELS.ta} value={stats.trimmedAvgPing} isHome={isHome} t={t} />
    </div>
  );
}
