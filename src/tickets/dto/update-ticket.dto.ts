import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from '@/tickets/dto/create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) { }
