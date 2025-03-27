'use client';
import type { Heartbeat, Monitor } from '@/types/monitor';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, MinusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MonitoringChart } from './charts/MonitoringChart';
import { ResponsStats } from './charts/ResponsStats';
import { StatusBlockIndicator } from './charts/StatusBlockIndicator';

interface MonitorCardProps {
  monitor: Monitor;
  heartbeats: Heartbeat[];
  uptime24h: number;
  isHome?: boolean;
}

export function MonitorCard({ monitor, heartbeats, uptime24h, isHome = true }: MonitorCardProps) {
  const router = useRouter();
  const lastHeartbeat = heartbeats[heartbeats.length - 1];
  const status = lastHeartbeat?.status ?? 0;

  const chartColor = status === 1 ? 'success' : status === 2 ? 'warning' : 'danger';

  const StatusIcon = status === 1 ? CheckCircle2 : status === 2 ? MinusCircle : AlertCircle;

  const uptimeData = [
    {
      value: uptime24h * 100,
      fill: uptime24h > 0.98 ? '#17c964' : uptime24h > 0.9 ? '#f5a524' : '#f31260',
    },
  ];

  const handleClick = () => {
    if (isHome) {
      router.push(`/monitor/${monitor.id}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
      onClick={handleClick}
    >
      <Card
        className={clsx(
          isHome ? 'w-full' : 'w-full md:w-2/3 mx-auto',
          isHome && 'cursor-pointer hover:shadow-lg transition-shadow',
        )}
      >
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col gap-2 w-[50%]">
            <div className="flex items-center gap-2">
              <StatusIcon className={`text-${chartColor} h-5 w-5 ml-1`} />
              <h3 className="text-lg font-semibold truncate">{monitor.name}</h3>
            </div>
            {monitor.tags && monitor.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {monitor.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    size="sm"
                    variant="flat"
                    style={{
                      backgroundColor: `${tag.color}15`,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                    {tag?.value && `: ${tag.value}`}
                  </Chip>
                ))}
              </div>
            )}
          </div>
          <div className={clsx('mr-4', isHome ? 'mr-0' : 'mr-4')}>
            <ResponsStats value={uptimeData[0].value} fill={uptimeData[0].fill} isHome={isHome} />
          </div>
        </CardHeader>
        <CardBody>
          <StatusBlockIndicator heartbeats={heartbeats} className="mb-4" isHome={isHome} />

          <Divider className="my-2" />

          <div className="space-y-4">
            <MonitoringChart heartbeats={heartbeats} height={120} color={chartColor} showGrid />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
