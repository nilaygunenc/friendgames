import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Runs after express-validator chains.
 * Collects all validation errors and returns 422 if any exist.
 */
export function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({
        field: e.type === 'field' ? e.path : undefined,
        message: e.msg,
      })),
    });
    return;
  }
  next();
}
