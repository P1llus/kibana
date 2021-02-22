/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import useInterval from 'react-use/lib/useInterval';
import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiText,
  FormattedMessage,
  EuiInMemoryTable,
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiEmptyPrompt,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import { useKibana } from '../common/lib/kibana';

type IngestPipelines = IngestPipeline[];

interface IngestPipeline {
  name: string;
  count: number;
  current: number;
  failed: number;
  time_in_millis: number;
  processors: Processor[];
}

interface Processor {
  name: string;
  type: string;
  stats: Stat;
}

interface Stat {
  count: number;
  current: number;
  failed: number;
  time_in_millis: number;
}

const PipelineListTableComponent = () => {
  const { http } = useKibana().services;
  const [lastFetched, setLastFetched] = useState<string | undefined>();
  const [tableItems, setTableItems] = useState<any[] | any[]>();
  const [pipelines, setPipelines] = useState<string | undefined>();
  const renderStatus = (failed) => {
    const color = failed <= 0 ? 'secondary' : 'danger';
    const label = failed <= 0 ? 'Healthy' : 'Critical';
    return <EuiBadge color={color}>{label}</EuiBadge>;
  };

  const renderEPS = (item) => {
    const seconds = item.time_in_millis / 1000;
    return seconds > 0 ? seconds.toFixed(1) : 0;
  };

  const fetchPipelines = () => {
    http.get('/api/ingest_pipeline_monitoring/pipelines').then((onClickRes) => {
      setPipelines(onClickRes.data);
      setLastFetched(new Date().toISOString());
    });
    const items = [] as IngestPipelines;
    if (pipelines) {
      for (const node of Object.values(pipelines)) {
        for (const n of Object.values(node)) {
          Object.entries(n.ingest.pipelines).forEach(([key, value]) => {
            const item: IngestPipeline = {
              name: key,
              count: value.count,
              current: value.current,
              failed: value.failed,
              time_in_millis: value.time_in_millis,
              processors: value.processors,
            };
            items.push(item);
          });
        }
      }
      setTableItems(items);
    }
  };

  useInterval(fetchPipelines, 5000);
  const actions = [
    {
      name: 'Edit',
      isPrimary: true,
      description: 'Edit this user',
      icon: 'pencil',
      type: 'icon',
      href: 'https://elastic.co/',
      'data-test-subj': 'action-outboundlink',
    },
  ];

  const columns = [
    {
      field: 'name',
      name: 'Pipeline Name',
      sortable: true,
      truncateText: false,
    },
    {
      field: 'healthy',
      name: 'Health Status',
      sortable: true,
      truncateText: true,
      render: (_name, item) => renderStatus(item.failed),
    },
    {
      field: 'processors',
      name: 'Processor Count',
      sortable: true,
      truncateText: true,
      render: (_name, item) => item.processors.length,
    },
    {
      field: 'failed',
      name: 'Error Count',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'current',
      name: 'Events in Pipeline',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'time_in_millis',
      name: 'Total Seconds Spent',
      sortable: true,
      truncateText: true,
      render: (_name, item) => renderEPS(item),
    },
    {
      field: 'count',
      name: 'Total Events',
      sortable: true,
      truncateText: true,
    },
    {
      name: 'Actions',
      actions,
    },
  ];

  const search = {
    box: {
      incremental: true,
      schema: true,
    },
    filters: [
      {
        type: 'is',
        field: 'healthy',
        name: 'Healthy',
        negatedName: 'Critical',
      },
    ],
  };
  const onClickHandler = () => {
    notifications.toasts.addSuccess(
      i18n.translate('ingestPipelineMonitoring.dataUpdated', {
        defaultMessage: 'Data updated',
      })
    );
    fetchPipelines();
  };

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={true}>
        <EuiText>
          <p>
            <FormattedMessage
              id="ingestPipelineMonitoring.timestampText"
              defaultMessage="Last fetched pipeline at: {last}"
              values={{
                last: lastFetched ? lastFetched : 'Never',
              }}
            />
          </p>
          <EuiButton type="primary" size="s" onClick={onClickHandler}>
            <FormattedMessage id="ingestPipelineMonitoring.buttonText" defaultMessage="Get data" />
          </EuiButton>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={true}>
        <EuiInMemoryTable
          items={tableItems || []}
          columns={columns}
          search={search}
          pagination={true}
          sorting={true}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export const PipelineListTable = React.memo(PipelineListTableComponent);
