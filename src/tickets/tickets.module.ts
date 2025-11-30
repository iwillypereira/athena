import { Module } from '@nestjs/common';
import { TicketService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './entities/ticket.entity';

@Module({
  imports: [
    // Registra el esquema 'Ticket' con Mongoose para que el modelo pueda ser inyectado.
    MongooseModule.forFeature([
      {
        name: Ticket.name, // Usa el nombre de la clase para el registro
        schema: TicketSchema, // Usa el esquema de Mongoose
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketService],
})
export class TicketsModule { }
