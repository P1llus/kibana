import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../../src/core/public';
import {
  IngestPipelineMonitoringPluginSetup,
  IngestPipelineMonitoringPluginStart,
  AppPluginStartDependencies,
} from './types';
import { Storage } from '../../../../src/plugins/kibana_utils/public';
import { PLUGIN_NAME } from '../common';

export class IngestPipelineMonitoringPlugin
  implements Plugin<IngestPipelineMonitoringPluginSetup, IngestPipelineMonitoringPluginStart> {
  private storage = new Storage(localStorage);

  public setup(core: CoreSetup): IngestPipelineMonitoringPluginSetup {
    const storage = this.storage;
    // Register an application into the side navigation menu
    core.application.register({
      id: 'ingestPipelineMonitoring',
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params, storage);
      },
    });

    // Return methods that should be available to other plugins
    return {};
  }

  public start(core: CoreStart): IngestPipelineMonitoringPluginStart {
    return {};
  }

  public stop() {}
}
