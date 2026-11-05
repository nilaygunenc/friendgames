import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ErrorHandler]', err.stack ?? err.message);

  if (res.headersSent) return;

  // Distinguish known error types
  if (err.name === 'SyntaxError') {
    res.status(400).json({ error: 'Malformed JSON body' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
