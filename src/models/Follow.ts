import {
  DataTypes,
  Model,
  Optional,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../db/connection';

export interface FollowAttributes {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

type FollowCreationAttributes = Optional<FollowAttributes, 'id' | 'createdAt'>;

export class Follow
  extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>>
  implements FollowAttributes
{
  declare id: CreationOptional<string>;
  declare followerId: string;
  declare followingId: string;
  declare createdAt: CreationOptional<Date>;
}

Follow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'follows',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id'],
      },
    ],
  }
);
