import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './prestamos.entity';

/**
 * Este es un controlador solo de ejemplo, el cual tiene como unico objetivo mostrar como usar el repositorio para interactuar con la base de datos
 * En una arquitectura con una buena separación de capas, no deberíamos inyectar el repositorio en el controlador
 * Este ejemplo no tiene ninguna arquitectura propuesta, usted debería plantear una arquitectura y realizar la separación de capas correcta
 * Acá se hizo solo con el objetivo de que usted vea como usar el objeto repositorio y lo pueda usar en otro objeto
 *
 */
@Controller('prestamo')
export class PrestamoController {
  constructor(
    @InjectRepository(Prestamo)
    private repositorioPrestamo: Repository<Prestamo>,
  ) {}
  calcularFecha(tipoUsuario) {
    const fechaActual = new Date();
    let fechaDevolucion: any = new Date();
    let diasDevolucion = 0;
    switch (tipoUsuario) {
      case 1:
        diasDevolucion = 10;
        break;
      case 2:
        diasDevolucion = 8;
        break;
      case 3:
        diasDevolucion = 7;
        break;
    }
    // let contador = 0;
    // while (contador < diasDevolucion) {
    // fechaDevolucion = new Date(
    //   fechaActual.setDate(fechaActual.getDate() + diasDevolucion),
    // );
    //   if (fechaDevolucion.getDay() != 0 && fechaDevolucion.getDay() != 6) {
    //     contador++;
    //   }
    // }
    fechaDevolucion = new Date(
      fechaActual.setDate(fechaActual.getDate() + diasDevolucion),
    );
    fechaDevolucion = fechaDevolucion.toISOString();
    fechaDevolucion = fechaDevolucion.split('T')[0].split('-').reverse();
    fechaDevolucion[1] = fechaDevolucion[1].split('')[1];
    return fechaDevolucion.join('/');
  }
  @Get()
  async getPrestamos(): Promise<Prestamo[]> {
    return this.repositorioPrestamo.find();
  }
  @Get('/:id')
  async getPrestamo(@Param('id') id: number): Promise<Prestamo> {
    return this.repositorioPrestamo.findOne({ id });
  }
  @Post()
  async nuevoPrestamo(
    @Body() datos: Prestamo,
  ): Promise<
    { id: number; fechaMaximaDevolucion: string } | { mensaje: string }
  > {
    if (datos.tipoUsuario > 0 && datos.tipoUsuario < 4) {
      const prestamoAnterior = await this.repositorioPrestamo.find({
        identificacionUsuario: datos.identificacionUsuario,
      });
      if (prestamoAnterior.length == 0) {
        datos.fechaMaximaDevolucion = this.calcularFecha(datos.tipoUsuario);
        const nuevoPrestamo = await this.repositorioPrestamo.save(
          this.repositorioPrestamo.create(datos),
        );
        return {
          id: nuevoPrestamo.id,
          fechaMaximaDevolucion: nuevoPrestamo.fechaMaximaDevolucion,
        };
      } else {
        return {
          mensaje: `El usuario con identificación ${datos.identificacionUsuario} ya tiene un libro prestado por lo cual no se le puede realizar otro préstamo`,
        };
      }
    } else {
      return {
        mensaje: `"Tipo de usuario no permitido en la biblioteca"`,
      };
    }
  }
}
