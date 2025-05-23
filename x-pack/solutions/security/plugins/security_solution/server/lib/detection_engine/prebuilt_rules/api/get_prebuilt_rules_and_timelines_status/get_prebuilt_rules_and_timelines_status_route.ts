/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { transformError } from '@kbn/securitysolution-es-utils';
import { InstallPrepackedTimelinesRequestBody } from '../../../../../../common/api/timeline';
import { buildSiemResponse } from '../../../routes/utils';
import type { SecuritySolutionPluginRouter } from '../../../../../types';

import {
  ReadPrebuiltRulesAndTimelinesStatusResponse,
  PREBUILT_RULES_STATUS_URL,
} from '../../../../../../common/api/detection_engine/prebuilt_rules';

import { getExistingPrepackagedRules } from '../../../rule_management/logic/search/get_existing_prepackaged_rules';
import { findRules } from '../../../rule_management/logic/search/find_rules';
import { getRulesToInstall } from '../../logic/get_rules_to_install';
import { getRulesToUpdate } from '../../logic/get_rules_to_update';
import { createPrebuiltRuleAssetsClient } from '../../logic/rule_assets/prebuilt_rule_assets_client';
import { rulesToMap } from '../../logic/utils';

import { buildFrameworkRequest } from '../../../../timeline/utils/common';
import { checkTimelinesStatus } from '../../../../timeline/utils/check_timelines_status';

export const getPrebuiltRulesAndTimelinesStatusRoute = (router: SecuritySolutionPluginRouter) => {
  router.versioned
    .get({
      access: 'public',
      path: PREBUILT_RULES_STATUS_URL,
      security: {
        authz: {
          requiredPrivileges: ['securitySolution'],
        },
      },
    })
    .addVersion(
      {
        version: '2023-10-31',
        validate: false,
      },
      async (context, request, response) => {
        const siemResponse = buildSiemResponse(response);
        const ctx = await context.resolve(['core', 'alerting']);
        const savedObjectsClient = ctx.core.savedObjects.client;
        const rulesClient = await ctx.alerting.getRulesClient();
        const ruleAssetsClient = createPrebuiltRuleAssetsClient(savedObjectsClient);

        try {
          const latestPrebuiltRules = await ruleAssetsClient.fetchLatestAssets();

          const customRules = await findRules({
            rulesClient,
            perPage: 1,
            page: 1,
            sortField: 'enabled',
            sortOrder: 'desc',
            filter: 'alert.attributes.params.immutable: false',
            fields: undefined,
          });

          const installedPrebuiltRules = rulesToMap(
            await getExistingPrepackagedRules({ rulesClient })
          );

          const rulesToInstall = getRulesToInstall(latestPrebuiltRules, installedPrebuiltRules);
          const rulesToUpdate = getRulesToUpdate(latestPrebuiltRules, installedPrebuiltRules);

          const frameworkRequest = await buildFrameworkRequest(context, request);
          const prebuiltTimelineStatus = await checkTimelinesStatus(frameworkRequest);
          const validatedPrebuiltTimelineStatus =
            InstallPrepackedTimelinesRequestBody.parse(prebuiltTimelineStatus);

          const responseBody: ReadPrebuiltRulesAndTimelinesStatusResponse = {
            rules_custom_installed: customRules.total,
            rules_installed: installedPrebuiltRules.size,
            rules_not_installed: rulesToInstall.length,
            rules_not_updated: rulesToUpdate.length,
            timelines_installed: validatedPrebuiltTimelineStatus?.prepackagedTimelines.length ?? 0,
            timelines_not_installed:
              validatedPrebuiltTimelineStatus?.timelinesToInstall.length ?? 0,
            timelines_not_updated: validatedPrebuiltTimelineStatus?.timelinesToUpdate.length ?? 0,
          };

          return response.ok({
            body: ReadPrebuiltRulesAndTimelinesStatusResponse.parse(responseBody),
          });
        } catch (err) {
          const error = transformError(err);
          return siemResponse.error({
            body: error.message,
            statusCode: error.statusCode,
          });
        }
      }
    );
};
