import { IRouter } from '../../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/ingest_pipeline_monitoring/pipelines',
      validate: false,
    },
    async (context, request, response) => {
      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const data = await esClient.nodes.stats({
        metric: 'ingest',
        filter_path: 'nodes.*.ingest.pipelines',
      });
      return response.ok({
        body: {
          data: data.body,
        },
      });
    }
  );
}
