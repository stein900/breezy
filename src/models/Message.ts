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

export interface MessageAttributes {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'createdAt'>;

export class Message
  extends Model<InferAttributes<Message>, InferCreationAttributes<Message>>
  implements MessageAttributes
{
  declare id: CreationOptional<string>;
  declare conversationId: string;
  declare senderId: string;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'conversations', key: 'id' },
      onDelete: 'CASCADE',
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.STRING(config.messageMaxLength),
      allowNull: false,
      validate: { len: [1, config.messageMaxLength] },
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'messages',
    updatedAt: false,
  }
);
