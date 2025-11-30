import { IsString, IsNotEmpty, IsIn, IsOptional, Matches, IsISO8601 } from 'class-validator';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';
export class CreateTicketDto {

    @IsNotEmpty()
    @IsString()
    // Patrón para forzar que sea solo números (opcional, pero útil para ticketNumber)
    // @Matches(/^[0-9]+$/, { message: 'ticketNumber debe contener solo números' })
    ticketNumber: string;

    @IsNotEmpty()
    @IsString()
    shortText: string;

    @IsOptional()
    @IsString()
    longText?: string;

    @IsNotEmpty()
    @IsIn(Object.values(TicketStatus), { message: 'statusCode debe ser 0, 1 o 2.' })
    statusCode: TicketStatus;

    @IsNotEmpty()
    @IsIn(Object.values(TicketPriority), { message: 'priorityKey debe ser 1, 2 o 3.' })
    priorityKey: TicketPriority;

    @IsNotEmpty()
    @IsString()
    assignedToTechnical: string;

    @IsOptional()
    @IsString()
    assignedToFunctional?: string;

    @IsOptional()
    @IsString()
    sapModule?: string;

    @IsNotEmpty()
    @IsString()
    createdBy: string;

    // Si permites que se envíe la fecha de cierre en la creación (lo cual es raro, pero posible)
    @IsOptional()
    @IsISO8601({ strict: true }) // Valida que sea un formato de fecha ISO 8601 (como "2025-11-29T19:57:34.000Z")
    closedAt?: string;
}