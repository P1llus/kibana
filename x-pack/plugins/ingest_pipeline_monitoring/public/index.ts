import './index.scss';

import { IngestPipelineMonitoringPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new IngestPipelineMonitoringPlugin();
}
export { IngestPipelineMonitoringPluginSetup, IngestPipelineMonitoringPluginStart } from './types';
