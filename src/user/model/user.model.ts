import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  job: string;
}

export const UserSchema: MongooseSchema<UserDocument> =
  SchemaFactory.createForClass(User);

export const UserSchemaDefinition = {
  name: User.name,
  schema: UserSchema,
};
