/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { compact, isObject } from 'lodash';

type Maybe<T> = T | null | undefined;

export interface KeyValuePair {
  key: string;
  value: unknown;
}

export const getFlattenedKeyValuePairs = (
  item: Maybe<Record<string, any | any[]>>,
  parentKey?: string
): KeyValuePair[] => {
  if (item) {
    const isArrayWithSingleValue = Array.isArray(item) && item.length === 1;
    return Object.keys(item)
      .sort()
      .reduce((acc: KeyValuePair[], key) => {
        const childKey = isArrayWithSingleValue ? '' : key;
        const currentKey = compact([parentKey, childKey]).join('.');
        // item[key] can be a primitive (string, number, boolean, null, undefined) or Object or Array
        // @ts-expect-error upgrade typescript v5.1.6
        if (isObject(item[key])) {
          // @ts-expect-error upgrade typescript v5.1.6
          return acc.concat(getFlattenedKeyValuePairs(item[key], currentKey));
        } else {
          // @ts-expect-error upgrade typescript v5.1.6
          acc.push({ key: currentKey, value: item[key] });
          return acc;
        }
      }, []);
  }
  return [];
};
