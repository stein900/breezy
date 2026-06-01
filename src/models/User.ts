import {
  DataTypes,
  Model,
  Optional,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../db/connection';
import { UserRole } from '../types';

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string | null;
  profilePhoto: string | null;
  role: UserRole;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'bio' | 'profilePhoto' | 'role' | 'isSuspended' | 'createdAt' | 'updatedAt'
>;

export class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes
{
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare displayName: string;
  declare bio: CreationOptional<string | null>;
  declare profilePhoto: CreationOptional<string | null>;
  declare role: CreationOptional<UserRole>;
  declare isSuspended: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  async comparePassword(candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
  }

  toPublicJSON(): {
    id: string;
    username: string;
    email: string;
    displayName: string;
    bio: string | null;
    profilePhoto: string | null;
    role: UserRole;
    createdAt: Date;
  } {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      displayName: this.displayName,
      bio: this.bio,
      profilePhoto: this.profilePhoto,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        is: /^[a-zA-Z0-9_]+$/,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { len: [8, 255] },
    },
    displayName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { len: [1, 50] },
    },
    bio: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
    isSuspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);
