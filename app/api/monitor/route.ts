import { createApiResponse } from '@/app/lib/api-utils';
import { getMonitoringData } from '@/services/monitor.server';

export async function GET() {
  return createApiResponse(async () => getMonitoringData(), {
    maxAge: 60, // Cache for 1 minute
    revalidate: 30,
  });
}
