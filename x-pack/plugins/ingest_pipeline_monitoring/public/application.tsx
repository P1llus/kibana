import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { I18nProvider } from '@kbn/i18n/react';
import { EuiErrorBoundary } from '@elastic/eui';
import { AppMountParameters, CoreStart } from '../../../../src/core/public';
import { AppPluginStartDependencies } from './types';
import { IngestPipelineMonitoringApp } from './components/app';
import { KibanaContextProvider } from './common/lib/kibana';
import { PLUGIN_NAME } from '../common';

export const renderApp = (
  core: CoreStart,
  services: AppPluginStartDependencies,
  { element, history }: AppMountParameters,
  storage: Storage
) => {
  ReactDOM.render(
    <KibanaContextProvider
      services={{
        appName: PLUGIN_NAME,
        ...core,
        ...services,
        storage,
      }}
    >
      <EuiErrorBoundary>
        <Router history={history}>
          <I18nProvider>
            <IngestPipelineMonitoringApp />
          </I18nProvider>
        </Router>
      </EuiErrorBoundary>
    </KibanaContextProvider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
