/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { EcsEvent } from '@kbn/core/server';
import type { ArrayElement } from '@kbn/utility-types';

export enum SiemMigrationsAuditActions {
  SIEM_MIGRATION_STARTED = 'siem_migration_started',
  SIEM_MIGRATION_STOPPED = 'siem_migration_stopped',
  SIEM_MIGRATION_CREATED = 'siem_migration_created',
  SIEM_MIGRATION_UPDATED = 'siem_migration_updated',
  SIEM_MIGRATION_GET_INTEGRATIONS = 'siem_migration_get_integrations',
  SIEM_MIGRATION_GET_RULES = 'siem_migration_get_rules',
  SIEM_MIGRATION_CREATED_LOOKUP = 'siem_migration_created_lookup',
  SIEM_MIGRATION_CREATED_RULE = 'siem_migration_created_rule',
  SIEM_MIGRATION_INSTALLED_RULE = 'siem_migration_installed_rule',
}

export enum AUDIT_TYPE {
  CHANGE = 'change',
  START = 'start',
  END = 'end',
  ACCESS = 'access',
  CREATION = 'creation',
}

export enum AUDIT_CATEGORY {
  API = 'api',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  WEB = 'web',
}

export enum AUDIT_OUTCOME {
  FAILURE = 'failure',
  SUCCESS = 'success',
  UNKNOWN = 'unknown',
}

export const siemMigrationAuditEventType: Record<
  SiemMigrationsAuditActions,
  ArrayElement<EcsEvent['type']>
> = {
  siem_migration_started: AUDIT_TYPE.START,
  siem_migration_stopped: AUDIT_TYPE.END,
  siem_migration_created: AUDIT_TYPE.CREATION,
  siem_migration_updated: AUDIT_TYPE.CHANGE,
  siem_migration_get_integrations: AUDIT_TYPE.ACCESS,
  siem_migration_get_rules: AUDIT_TYPE.ACCESS,
  siem_migration_created_rule: AUDIT_TYPE.CREATION,
  siem_migration_installed_rule: AUDIT_TYPE.CREATION,
  siem_migration_created_lookup: AUDIT_TYPE.CREATION,
};

export interface SiemMigrationAuditEvent {
  action: SiemMigrationsAuditActions;
  message: string;
  outcome: AUDIT_OUTCOME;
  error?: Error;
}
