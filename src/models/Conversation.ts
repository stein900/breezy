import {
  DataTypes,
  Model,
  Optional,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../db/connection';

export interface ConversationAttributes {
  id: string;
  participantAId: string;
  participantBId: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type ConversationCreationAttributes = Optional<
  ConversationAttributes,
  'id' | 'lastMessageAt' | 'createdAt' | 'updatedAt'
>;

export class Conversation
  extends Model<InferAttributes<Conversation>, InferCreationAttributes<Conversation>>
  implements ConversationAttributes
{
  declare id: CreationOptional<string>;
  declare participantAId: string;
  declare participantBId: string;
  declare lastMessageAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    participantAId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    participantBId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'conversations',
    indexes: [{ unique: true, fields: ['participant_a_id', 'participant_b_id'] }],
  }
);
