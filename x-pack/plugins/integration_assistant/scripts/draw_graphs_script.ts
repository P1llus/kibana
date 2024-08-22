/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ToolingLog } from '@kbn/tooling-log';
import fs from 'fs/promises';
import path from 'path';
import {
  ActionsClientChatOpenAI,
  ActionsClientSimpleChatModel,
} from '@kbn/langchain/server/language_models';
import { FakeLLM } from '@langchain/core/utils/testing';
import type { IScopedClusterClient } from '@kbn/core-elasticsearch-server';
import { getEcsGraph, getEcsSubGraph } from '../server/graphs/ecs/graph';
import { getCategorizationGraph } from '../server/graphs/categorization/graph';
import { getRelatedGraph } from '../server/graphs/related/graph';

// Some mock elements just to get the graph to compile
const mockLlm = new FakeLLM({
  response: JSON.stringify({}, null, 2),
}) as unknown as ActionsClientChatOpenAI | ActionsClientSimpleChatModel;
const client = 'test' as unknown as IScopedClusterClient;

const logger = new ToolingLog({
  level: 'info',
  writeTo: process.stdout,
});
logger.info('Compiling graphs');

async function saveFile(filename: string, buffer: Buffer) {
  const outputPath = path.join(__dirname, '../docs/imgs/', filename);
  logger.info(`Writing graph to ${outputPath}`);
  await fs.writeFile(outputPath, buffer);
}

async function drawEcsGraph() {
  const ecsGraph = (await getEcsGraph(mockLlm)).getGraph();
  const output = await ecsGraph.drawMermaidPng();
  const buffer = Buffer.from(await output.arrayBuffer());
  await saveFile('ecs_graph.png', buffer);
}

async function drawEcsSubGraph() {
  const ecsGraph = (await getEcsSubGraph(mockLlm)).getGraph();
  const output = await ecsGraph.drawMermaidPng();
  const buffer = Buffer.from(await output.arrayBuffer());
  await saveFile('ecs_subgraph.png', buffer);
}

async function drawCategorizationGraph() {
  const categorizationGraph = (await getCategorizationGraph(client, mockLlm)).getGraph();
  const output = await categorizationGraph.drawMermaidPng();
  const buffer = Buffer.from(await output.arrayBuffer());
  await saveFile('categorization_graph.png', buffer);
}

async function drawRelatedGraph() {
  const relatedGraph = (await getRelatedGraph(client, mockLlm)).getGraph();
  const output = await relatedGraph.drawMermaidPng();
  const buffer = Buffer.from(await output.arrayBuffer());
  await saveFile('related_graph.png', buffer);
}

export async function drawGraphs() {
  drawEcsGraph();
  drawEcsSubGraph();
  drawCategorizationGraph();
  drawRelatedGraph();
}
