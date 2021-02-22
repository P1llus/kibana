import './index.scss';

import { PluginInitializerContext } from 'src/core/public';
import { IngestPipelineMonitoringPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin(): PluginInitializerContext {
  return new IngestPipelineMonitoringPlugin();
}
export { IngestPipelineMonitoringPluginSetup, IngestPipelineMonitoringPluginStart } from './types';
