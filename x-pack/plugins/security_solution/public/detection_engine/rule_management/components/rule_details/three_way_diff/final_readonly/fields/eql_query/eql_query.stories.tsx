/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import type { Story } from '@storybook/react';
import { FieldFinalReadOnly } from '../../field_final_readonly';
import type { DiffableRule } from '../../../../../../../../../common/api/detection_engine';
import { ThreeWayDiffStorybookProviders } from '../../storybook/three_way_diff_storybook_providers';
import { EqlQueryReadOnly } from './eql_query';
import {
  dataSourceWithDataView,
  dataSourceWithIndexPatterns,
  eqlQuery,
  mockDataView,
  mockEqlRule,
} from '../../storybook/mocks';

export default {
  component: EqlQueryReadOnly,
  title: 'Rule Management/Prebuilt Rules/Upgrade Flyout/ThreeWayDiff/FieldReadOnly/eql_query',
};

interface TemplateProps {
  finalDiffableRule: DiffableRule;
  kibanaServicesOverrides?: Record<string, unknown>;
}

const Template: Story<TemplateProps> = (args) => {
  return (
    <ThreeWayDiffStorybookProviders
      kibanaServicesOverrides={args.kibanaServicesOverrides}
      finalDiffableRule={args.finalDiffableRule}
      fieldName="eql_query"
    >
      <FieldFinalReadOnly />
    </ThreeWayDiffStorybookProviders>
  );
};

export const EqlQueryWithIndexPatterns = Template.bind({});

EqlQueryWithIndexPatterns.args = {
  finalDiffableRule: mockEqlRule({
    eql_query: eqlQuery,
    data_source: dataSourceWithIndexPatterns,
  }),
  kibanaServicesOverrides: {
    data: {
      dataViews: {
        create: async () => mockDataView(),
      },
    },
  },
};

export const EqlQueryWithDataView = Template.bind({});

EqlQueryWithDataView.args = {
  finalDiffableRule: mockEqlRule({
    eql_query: eqlQuery,
    data_source: dataSourceWithDataView,
  }),
  kibanaServicesOverrides: {
    data: {
      dataViews: {
        get: async () => mockDataView(),
      },
    },
  },
};
