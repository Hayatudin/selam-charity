/**
 * MASTER SCHEMA EXPORT
 * 
 * Re-exports all tables and relations across CORE, AGENCY, and CHARITY domains.
 * All existing server routes and Drizzle pool definitions remain 100% backward compatible.
 */

export * from './schemas/core';
export * from './schemas/agency';
export * from './schemas/charity';
export * from './schemas/relations';
