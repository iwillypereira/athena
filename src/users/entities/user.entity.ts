import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    strict: true
})
export class User {

    @Prop({ required: true, type: String })
    firstName: string;

    @Prop({ required: true, type: String })
    lastName: string;

    @Prop({
        required: true,
        unique: true,
        index: true,
        type: String,
        lowercase: true, // Buena práctica para correos electrónicos
        trim: true
    })
    email: string;

    @Prop({ required: true, type: String, select: false })
    password: string;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

}

// 3. Creación del Factory para NestJS Module
export const UserSchema = SchemaFactory.createForClass(User);