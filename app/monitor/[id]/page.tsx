'use client';

import AutoRefresh from '@/components/AutoRefresh';
import { MonitorCard } from '@/components/MonitorCard';
import { MonitorCardSkeleton } from '@/components/ui/CommonSkeleton';
import type { Monitor, MonitorGroup, MonitoringData } from '@/types/monitor';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function MonitorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();

  const resolvedParams = use(params);
  const router = useRouter();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [data, setData] = useState<MonitoringData>({
    heartbeatList: {},
    uptimeList: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!resolvedParams.id) return;

    try {
      const monitorId = Number.parseInt(resolvedParams.id, 10);

      // 获取监控数据
      const monitorResponse = await fetch('/api/monitor');
      const monitorData = await monitorResponse.json();

      if (!monitorData.success) {
        throw new Error('获取监控数据失败');
      }

      // 在所有监控组中查找指定 ID 的监控项
      const foundMonitor = monitorData.monitorGroups
        .flatMap((group: MonitorGroup) => group.monitorList)
        .find((m: Monitor) => m.id === monitorId);

      if (!foundMonitor) {
        throw new Error(t('errorMonitorNotFound'));
      }

      setMonitor(foundMonitor);

      // 提取该监控项的数据
      const monitoringData = {
        heartbeatList: {
          [monitorId]: monitorData.data.heartbeatList[monitorId] || [],
        },
        uptimeList: {
          [`${monitorId}_24`]: monitorData.data.uptimeList[`${monitorId}_24`] || 0,
        },
      };

      setData(monitoringData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('errorRequestData'));
      console.error(t('errorRequestData'), ':', error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.id, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBack = () => {
    try {
      router.back();
      setTimeout(() => {
        if (window.location.pathname === `/monitor/${resolvedParams.id}`) {
          router.push('/');
        }
      }, 500);
    } catch {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <div className="h-10 w-32 bg-default-100 rounded-lg" />
            </motion.div>
            <MonitorCardSkeleton />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !monitor) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
      >
        <p className="text-xl text-gray-500">{error || t('errorMonitorNotFound')}</p>
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          {t('pageBack')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <AutoRefresh onRefresh={fetchData} interval={60000}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← {t('pageBackMonitor')}
              </button>
            </motion.div>
            <MonitorCard
              monitor={monitor}
              heartbeats={data.heartbeatList[monitor.id] || []}
              uptime24h={data.uptimeList[`${monitor.id}_24`] || 0}
              isHome={false}
            />
          </div>
        </div>
      </AutoRefresh>
    </motion.div>
  );
}
