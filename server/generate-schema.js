const fs = require('fs');

let sql = fs.readFileSync('drizzle/0000_military_oracle.sql', 'utf8');

// Remove Drizzle statement breakpoints
sql = sql.replace(/--> statement-breakpoint/g, '');

// Clean duplicate unique constraints like 'CONSTRAINT Candidate_passportNumber_key UNIQUE(passportNumber)'
sql = sql.replace(/,\s*CONSTRAINT\s+`[^`]+_key`\s+UNIQUE\([^)]+\)/g, '');

// Add IF NOT EXISTS to CREATE TABLE
sql = sql.replace(/CREATE TABLE `(\w+)`/g, 'CREATE TABLE IF NOT EXISTS `$1`');

// Add ENGINE and CHARSET only to CREATE TABLE closing parentheses
sql = sql.replace(/\)\s*;\s*(?=(CREATE TABLE|CREATE INDEX|$))/g, ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n');

// Clean duplicate unique constraints like 'CONSTRAINT Candidate_passportNumber_key UNIQUE(passportNumber)'
sql = sql.replace(/,\s*CONSTRAINT\s+`[^`]+_key`\s+UNIQUE\([^)]+\)/g, '');

// Clean any leftover ENGINE clause on CREATE INDEX statements
sql = sql.replace(/(CREATE INDEX[^\n;]+)\s+ENGINE=InnoDB[^;]*;/g, '$1;');

const header = `-- ================================================================
-- SELAM CHARITY MANAGEMENT SYSTEM - FULL PRODUCTION DATABASE SCHEMA
-- Target: MySQL 5.7+ / 8.0+ / MariaDB (cPanel phpMyAdmin)
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

`;

const seed = `
-- ================================================================
-- DEFAULT ADMIN USER (admin@selamcharity.org)
-- ================================================================
INSERT INTO \`User\` (\`id\`, \`name\`, \`email\`, \`emailVerified\`, \`role\`, \`major_agency\`, \`createdAt\`, \`updatedAt\`) 
VALUES ('dev-admin', 'Selam Admin', 'admin@selamcharity.org', 1, 'super_admin', 'Selam', NOW(), NOW())
ON DUPLICATE KEY UPDATE \`role\` = 'super_admin';

SET FOREIGN_KEY_CHECKS = 1;
`;

fs.writeFileSync('schema.sql', header + sql.trim() + '\n' + seed, 'utf8');
console.log('Clean schema.sql generated successfully. Size:', fs.statSync('schema.sql').size);
