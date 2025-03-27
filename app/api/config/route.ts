import { createApiResponse } from '@/app/lib/api-utils';
import { getGlobalConfig } from '@/services/config.server';

export async function GET() {
  return createApiResponse(() => getGlobalConfig(), {
    maxAge: 60,
    revalidate: 30,
  });
}
