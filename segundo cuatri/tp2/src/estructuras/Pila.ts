class Pila<T> {
  #items: T[] = [];

  //todo Agrega un elemento al tope (final) de la pila
  push(elemento: T): void {
    this.#items.push(elemento);
  }

  //! Saca y devuelve el elemento que está en el tope de la pila
  pop(): T | undefined {
    if (this.vacia) return undefined;
    return this.#items.pop();
  }

  //* Solo mira cual es el elemento en el tope sin sacarlo de la pila
  tope(): T | undefined {
    if (this.vacia) return undefined;
    return this.#items[this.#items.length - 1];
  }

  //todo Verifica si la pila no tiene elementos
  get vacia(): boolean {
    return this.#items.length === 0;
  }

  //* Devuelve la cantidad total de elementos apilados
  get tamanio(): number {
    return this.#items.length;
  }

  //! Devuelve una copia exacta del array actual para no modificar el original
  aArray(): T[] {
    return [...this.#items];
  }
}

//! PRUEBA

const acciones = new Pila<string>();

acciones.push("Agregar Hamburguesa");
acciones.push("Agregar Papas");
acciones.push("Agregar Gaseosa");

console.log("Última acción realizada:", acciones.tope()); // Tiene que decir "Agregar Gaseosa"

console.log("Deshaciendo acción:", acciones.pop()); // Saca "Agregar Gaseosa"
console.log("Deshaciendo acción:", acciones.pop()); // Saca "Agregar Papas"

console.log("Acciones restantes en historial:", acciones.aArray()); // ["Agregar Hamburguesa"]
console.log("Tamaño de la pila:", acciones.tamanio); // 1