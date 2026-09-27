import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { streamFile } from '../lib/utils/file';

// Resolve project root anchored from __dirname (works on both local dev and cPanel).
// __dirname = .../dist/routes  →  up 2 levels = project root
function getProjectRoot(): string {
  const fromDirname = path.resolve(__dirname, '..', '..');
  if (fs.existsSync(path.join(fromDirname, 'public'))) return fromDirname;
  return process.cwd();
}

// Files are stored under the public/uploads directory
// The route expects a relative path (e.g., 'candidate/12345/document.pdf')
// and will resolve it safely inside the uploads folder.

const router = express.Router();

router.get('/:file(*)', (req: Request, res: Response) => {
  const { file } = req.params;
  
  // Clean path: replace backslashes and remove leading slashes
  let cleanPath = file.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Strip 'uploads/' if present to avoid duplication
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.substring(8);
  }
  
  // Prevent directory traversal attacks
  cleanPath = path.normalize(cleanPath).replace(/^\.\.[/\\]/, '');
  
  const fullPath = path.join(getProjectRoot(), 'public', 'uploads', cleanPath);
  streamFile(res, fullPath);
});

export default router;
