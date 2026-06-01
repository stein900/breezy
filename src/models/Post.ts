import {
  DataTypes,
  Model,
  Optional,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../db/connection';
import { config } from '../config';

export interface PostAttributes {
  id: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type PostCreationAttributes = Optional<
  PostAttributes,
  'id' | 'parentId' | 'createdAt' | 'updatedAt'
>;

export class Post
  extends Model<InferAttributes<Post>, InferCreationAttributes<Post>>
  implements PostAttributes
{
  declare id: CreationOptional<string>;
  declare userId: string;
  declare content: string;
  declare parentId: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Post.init(
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
    content: {
      type: DataTypes.STRING(config.postMaxLength),
      allowNull: false,
      validate: {
        len: [1, config.postMaxLength],
      },
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'posts', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'posts',
  }
);
