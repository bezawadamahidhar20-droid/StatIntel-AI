/**
 * StatIntel-AI Government Data Connectors & API Services
 */

export * from './types';
export * from './cache';
export * from './http';
export * from './dataGovIn';
export * from './mospi';
export * from './rbi';
export * from './census';
export * from './igot';

import { dataGovIn } from './dataGovIn';
import { mospi } from './mospi';
import { rbi } from './rbi';
import { census } from './census';
import { igotApi } from './igot';
import { cache } from './cache';

export default {
  dataGovIn,
  mospi,
  rbi,
  census,
  igotApi,
  cache,
};
