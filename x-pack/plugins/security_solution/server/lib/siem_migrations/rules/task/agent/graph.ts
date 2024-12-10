/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { END, START, StateGraph } from '@langchain/langgraph';
import { getCreateSemanticQueryNode } from './nodes/create_semantic_query';
import { getMatchPrebuiltRuleNode } from './nodes/match_prebuilt_rule';

import { migrateRuleState } from './state';
import type { MigrateRuleGraphParams } from './types';

export function getRuleMigrationAgent({
  model,
  inferenceClient,
  ruleMigrationsRetriever,
  connectorId,
  logger,
}: MigrateRuleGraphParams) {
  const matchPrebuiltRuleNode = getMatchPrebuiltRuleNode({
    model,
    ruleMigrationsRetriever,
  });
  // const translationSubGraph = getTranslateRuleGraph({
  //  inferenceClient,
  //  ruleMigrationsRetriever,
  //  connectorId,
  //  logger,
  // });
  const createSemanticQueryNode = getCreateSemanticQueryNode({ model });
  // const processQueryNode = getProcessQueryNode({ model, ruleMigrationsRetriever });

  const siemMigrationAgentGraph = new StateGraph(migrateRuleState)
    // Nodes
    .addNode('createSemanticQuery', createSemanticQueryNode)
    .addNode('matchPrebuiltRule', matchPrebuiltRuleNode)
    // Edges
    .addEdge(START, 'createSemanticQuery')
    .addEdge('createSemanticQuery', 'matchPrebuiltRule')
    .addEdge('matchPrebuiltRule', END);

  const graph = siemMigrationAgentGraph.compile();
  graph.name = 'Rule Migration Graph'; // Customizes the name displayed in LangSmith
  return graph;
}
