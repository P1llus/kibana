import React, { useState, useEffect, useCallback } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import moment from 'moment';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeaderSection,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiEmptyPrompt,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';

import { Switch, Route } from 'react-router-dom';
import { PipelineListTable } from '../pipelines';
import { PLUGIN_NAME } from '../../common';

export const IngestPipelineMonitoringAppComponent = () => {
  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <h1>
                <FormattedMessage
                  id="ingestPipelineMonitoring.helloWorldText"
                  defaultMessage="{name}"
                  values={{ name: PLUGIN_NAME }}
                />
              </h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentBody>
            <EuiSpacer />

            <Switch>
              <Route path={`/pipelines`}>
                <PipelineListTable />
              </Route>
            </Switch>

            <EuiSpacer />
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};

export const IngestPipelineMonitoringApp = React.memo(IngestPipelineMonitoringAppComponent);
