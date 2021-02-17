import { PluginInitializerContext } from '../../../../src/core/server';
import { IngestPipelineMonitoringPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new IngestPipelineMonitoringPlugin(initializerContext);
}

export { IngestPipelineMonitoringPluginSetup, IngestPipelineMonitoringPluginStart } from './types';
