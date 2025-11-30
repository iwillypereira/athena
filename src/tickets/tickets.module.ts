import { Module } from '@nestjs/common';
import { TicketService } from '@/tickets/tickets.service';
import { TicketsController } from '@/tickets/tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from '@/tickets/entities/ticket.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketService],
})
export class TicketsModule { }
