import {
  DataTypes,
  Model,
  Optional,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../db/connection';

export interface RepostAttributes {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
}

type RepostCreationAttributes = Optional<RepostAttributes, 'id' | 'createdAt'>;

export class Repost
  extends Model<InferAttributes<Repost>, InferCreationAttributes<Repost>>
  implements RepostAttributes
{
  declare id: CreationOptional<string>;
  declare userId: string;
  declare postId: string;
  declare createdAt: CreationOptional<Date>;
}

Repost.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'reposts',
    updatedAt: false,
    indexes: [{ unique: true, fields: ['user_id', 'post_id'] }],
  }
);
