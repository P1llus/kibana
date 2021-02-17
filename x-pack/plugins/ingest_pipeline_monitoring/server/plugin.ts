import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../../src/core/server';

import { IngestPipelineMonitoringPluginSetup, IngestPipelineMonitoringPluginStart } from './types';
import { defineRoutes } from './routes';

export class IngestPipelineMonitoringPlugin
  implements Plugin<IngestPipelineMonitoringPluginSetup, IngestPipelineMonitoringPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('ingestPipelineMonitoring: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('ingestPipelineMonitoring: Started');
    return {};
  }

  public stop() {}
}
