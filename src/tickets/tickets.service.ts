import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '@/tickets/entities/ticket.entity';
import { CreateTicketDto } from '@/tickets/dto/create-ticket.dto';
import { UpdateTicketDto } from '@/tickets/dto/update-ticket.dto';

@Injectable()
export class TicketService {
  // 1. Inyección del Modelo de Mongoose
  constructor(
    // El nombre inyectado ('Ticket') debe coincidir con el nombre de la clase del esquema
    @InjectModel(Ticket.name)
    private ticketModel: Model<TicketDocument>,
  ) { }

  // ----------------------------------------------------
  // 🟢 CREATE (POST)
  // ----------------------------------------------------
  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {

    // Crear una nueva instancia del modelo con los datos del DTO
    const createdTicket = new this.ticketModel(createTicketDto);

    // Guardar en la base de datos
    return createdTicket.save();
  }

  // ----------------------------------------------------
  // 🟡 READ (GET ALL)
  // ----------------------------------------------------
  async findAll(): Promise<Ticket[]> {
    // Usamos .lean() para un mejor performance en lecturas, 
    // ya que no necesitamos manipular los objetos Document de Mongoose.
    return this.ticketModel.find().lean().exec();
  }

  // ----------------------------------------------------
  // 🟡 READ (GET ONE by ID)
  // ----------------------------------------------------
  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(id).lean().exec();

    if (!ticket) {
      // Usar NotFoundException es la mejor práctica en NestJS
      throw new NotFoundException(`Ticket con ID "${id}" no encontrado.`);
    }

    return ticket;
  }

  // ----------------------------------------------------
  // 🔵 UPDATE (PATCH)
  // ----------------------------------------------------
  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {

    // Usamos findByIdAndUpdate para una sola operación atómica.
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(
        id,
        // El payload del DTO ya está validado
        { $set: updateTicketDto },
        { new: true } // { new: true } retorna el documento actualizado, no el original
      )
      .lean() // Usar lean aquí también es bueno si solo vas a devolverlo
      .exec();

    if (!updatedTicket) {
      throw new NotFoundException(`Ticket con ID "${id}" no encontrado para actualizar.`);
    }

    return updatedTicket;
  }

  // ----------------------------------------------------
  // 🔴 DELETE (DELETE)
  // ----------------------------------------------------
  async remove(id: string): Promise<void> {
    const result = await this.ticketModel.deleteOne({ _id: id }).exec();

    // Verificamos si se eliminó algo para lanzar 404 si el ID no existía
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Ticket con ID "${id}" no encontrado para eliminar.`);
    }
  }
}