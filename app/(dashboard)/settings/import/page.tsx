import { hasFeatureAccess } from '@/lib/plan-features-server';
import ImportClient from './ImportClient';

export default async function ImportPage() {
  const hasImportAccess = await hasFeatureAccess('hasImportExcel');

  return <ImportClient hasImportAccess={hasImportAccess} />;
}
