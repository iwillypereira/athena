import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

@Injectable()
export class UsersService {

  // 1. Inyección de Modelos
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) { }

  // ----------------------------------------------------
  // 🟢 CREATE (POST)
  // ----------------------------------------------------
  async create(createUserDto: CreateUserDto): Promise<User> {

    // 1. Hashear la Contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    // 2. Crear el Objeto del Usuario
    const userObject = {
      ...createUserDto,
      password: passwordHash
    };

    // 3. Intentar guardar y capturar el error de clave duplicada
    try {
      const createdUser = new this.userModel(userObject);
      return createdUser.save();
    } catch (error) {
      // Error E11000: Error de clave duplicada de MongoDB
      if (error.code === 11000 || (error instanceof mongo.MongoServerError && error.code === 11000)) {
        // Podrías revisar qué campo falló si tuvieras más de un índice único
        throw new BadRequestException('El correo electrónico ya está registrado.');
      }
      // Relanzar cualquier otro error que no sea de clave duplicada
      throw error;
    }
  }

  // ----------------------------------------------------
  // 🟡 READ (GET ALL)
  // ----------------------------------------------------
  async findAll(): Promise<User[]> {
    // Usamos .populate('roles') para incluir los detalles del rol
    return this.userModel
      .find()
      .lean()
      .exec();
  }

  // ----------------------------------------------------
  // 🟡 READ (GET ONE by ID)
  // ----------------------------------------------------
  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .lean()
      .populate('roles', 'name description')
      .exec();

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    return user;
  }

  // ----------------------------------------------------
  // 🔵 UPDATE (PATCH)
  // ----------------------------------------------------
  async update(id: string, updateuserDto: UpdateUserDto): Promise<User> {

    // 1. Actualización atómica en la base de datos
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: updateuserDto },
        {
          new: true, // 'new: true' retorna el doc actualizado
          runValidators: true // 'runValidators: true' aplica validaciones del esquema
        }
      )
      .lean()
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado para actualizar.`);
    }

    return updatedUser;
  }

  // ----------------------------------------------------
  // 🔴 DELETE (DELETE)
  // ----------------------------------------------------
  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado para eliminar.`);
    }
  }
}