import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  data: string; // Base64 encoded image data
}

export const ImageSchema = SchemaFactory.createForClass(Image);

export const ImageSchemaDefinition = {
  name: Image.name,
  schema: ImageSchema,
};
