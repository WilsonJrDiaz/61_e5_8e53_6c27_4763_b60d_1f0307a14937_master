export default class SolicitudPrestarLibroTest {
  constructor(
    public isbn: string,
    public identificacionUsuario: string,
    public tipoUsuario: number,
  ) {
    this.isbn = isbn;
    this.identificacionUsuario = identificacionUsuario;
    this.tipoUsuario = tipoUsuario;
  }
  get retorno() {
    return {
      isbn: this.isbn,
      identificacionUsuario: this.identificacionUsuario,
      tipoUsuario: this.tipoUsuario,
    };
  }
}
