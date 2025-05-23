/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { httpServiceMock } from '@kbn/core/public/mocks';

import { nextTick } from '@kbn/test-jest-helpers';

import { startAccessControlSync } from './start_access_control_sync_api_logic';

describe('startAccessControlSyncApiLogic', () => {
  describe('startAccessControlSync', () => {
    const http = httpServiceMock.createSetupContract();
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calls correct api', async () => {
      const promise = Promise.resolve('result');
      http.post.mockReturnValue(promise);
      const connectorId = 'test-connector-id-123';

      const result = startAccessControlSync({ connectorId, http });
      await nextTick();
      expect(http.post).toHaveBeenCalledWith(
        `/internal/content_connectors/connectors/${connectorId}/start_access_control_sync`
      );
      await expect(result).resolves.toEqual('result');
    });
  });
});
