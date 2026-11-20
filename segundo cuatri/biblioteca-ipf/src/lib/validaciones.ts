const REGEX_ISBN_13 = /^\d{13}$/;

export function normalizarIsbn(valor: string): string {
  return valor.replace(/[\s-]/g, '');
}

export function esIsbnValido(isbn: string): boolean {
  return REGEX_ISBN_13.test(isbn);
}

export function formatearFechaCorta(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) {
    return 'Fecha inválida';
  }
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

export function sumarDiasISO(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString();
}
