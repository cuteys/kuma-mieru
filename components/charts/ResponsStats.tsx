import { Tooltip } from '@heroui/react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

interface ResponsStatsProps {
  value: number;
  fill: string;
  isHome?: boolean;
}

export function ResponsStats({ value, fill, isHome }: ResponsStatsProps) {
  const data = [{ value, fill }];
  const t = useTranslations();

  const tooltipContent = !isHome ? (
    <div className="flex flex-col gap-2">
      <span className="text-md text-gray-500">
        {t('nodeUptimeStatus')}: {value.toFixed(2)}%
      </span>
    </div>
  ) : (
    `${t('nodeUptimeStatus')}: ${value.toFixed(2)}%`
  );

  return (
    <Tooltip
      content={tooltipContent}
      placement="left"
      delay={0}
      closeDelay={0}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: 'easeOut',
            },
          },
          enter: {
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: 'easeOut',
            },
          },
        },
      }}
    >
      <div className={clsx('inline-flex items-center', !isHome ? 'gap-2' : 'gap-1')}>
        <div className="w-10 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="65%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
              barSize={12}
              cx="50%"
              cy="50%"
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={30} fill={fill} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <span className="text-sm text-gray-500">{value.toFixed(2)}%</span>
      </div>
    </Tooltip>
  );
}
