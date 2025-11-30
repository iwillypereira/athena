import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- ENUMS para Seguridad de Tipos (Reutilizados) ---
export enum TicketStatus {
    CERRADO = '0',
    ABIERTO = '1',
    EN_PROGRESO = '2',
}

export enum TicketPriority {
    ALTA = '1',
    MEDIA = '2',
    BAJA = '3',
}

// --- CLASE ENTIDAD (MODELO DE LA BD) ---

// 1. Exportar el tipo del documento Mongoose
export type TicketDocument = Ticket & Document;

// 2. Definición de la Entidad/Schema con opciones de rendimiento
@Schema({
    timestamps: true, // Mongoose maneja createdAt y updatedAt
    strict: 'throw'  // Evita campos basura
})
export class Ticket {
    @Prop({ required: true, unique: true, index: true, type: String })
    ticketNumber: string;

    @Prop({ required: true, type: String, trim: true, maxlength: 100 })
    shortText: string;

    @Prop({ type: String })
    longText?: string;

    @Prop({
        required: true,
        enum: Object.values(TicketStatus),
        default: TicketStatus.ABIERTO,
        type: String,
    })
    statusCode: TicketStatus; // Usamos el Enum para tipado

    @Prop({
        required: true,
        enum: Object.values(TicketPriority),
        default: TicketPriority.MEDIA,
        type: String,
    })
    priorityKey: TicketPriority; // Usamos el Enum para tipado

    @Prop({ required: true, type: String })
    assignedToTechnical: string;

    @Prop({ type: String })
    assignedToFunctional?: string;

    @Prop({ type: String })
    sapModule?: string;

    @Prop({ required: true, type: String })
    createdBy: string;

    @Prop({ type: Date, required: false })
    closedAt?: Date;
}

// 3. Creación del Factory para NestJS Module
export const TicketSchema = SchemaFactory.createForClass(Ticket);

// 4. Implementación de índices compuestos si son necesarios (para performance)
// TicketSchema.index({ assignedToTechnical: 1, statusCode: 1 });