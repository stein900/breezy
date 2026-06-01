import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';
import { UserRole } from '../types';
import { UnauthorizedError, ValidationError, ForbiddenError } from '../utils/errors';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Token manquant'));
    return;
  }

  try {
    const token = header.slice(7);
    req.user = verifyToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Token invalide ou expiré'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    req.user = verifyToken(header.slice(7));
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}

export async function ensureNotSuspended(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    next(new UnauthorizedError());
    return;
  }

  const user = await User.findByPk(req.user.userId);
  if (!user || user.isSuspended) {
    next(new ForbiddenError('Compte suspendu'));
    return;
  }
  next();
}

export function validate(validations: ValidationChain[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ValidationError('Données invalides', errors.array()));
      return;
    }
    next();
  };
}
