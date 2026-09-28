import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { streamFile } from '../lib/utils/file';
import { getAllUploadsDirs, getUploadsRoot } from '../lib/upload';

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
  cleanPath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');
  
  // Search across all candidate uploads directories
  const candidateDirs = [getUploadsRoot(), ...getAllUploadsDirs()];
  for (const dir of candidateDirs) {
    const fullPath = path.join(dir, cleanPath);
    if (fs.existsSync(fullPath)) {
      return streamFile(res, fullPath);
    }
  }

  // Fallback to primary uploads root
  const defaultPath = path.join(getUploadsRoot(), cleanPath);
  streamFile(res, defaultPath);
});

export default router;
