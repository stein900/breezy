import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { User } from '../models';
import { signToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../utils/errors';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, email, password, displayName } = req.body;

    const existing = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (existing) {
      throw new ConflictError('Email ou username déjà utilisé');
    }

    const user = await User.create({ username, email, password, displayName });
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({ user: user.toPublicJSON(), token });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Identifiants invalides');
    }

    if (user.isSuspended) {
      throw new UnauthorizedError('Compte suspendu');
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({ user: user.toPublicJSON(), token });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findByPk(req.user!.userId);
    if (!user) {
      throw new UnauthorizedError();
    }
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}
