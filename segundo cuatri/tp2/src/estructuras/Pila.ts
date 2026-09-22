export class Pila<T> {
  #items: T[] = [];

  push(elemento: T): void {
    this.#items.push(elemento);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  get vacia(): boolean {
    return this.#items.length === 0;
  }

  // getter tamaño
  get tamanio(): number {
    return this.#items.length;
  }

  //método aArray que devuelve una copia
  aArray(): T[] {
    //! usamos reverse() para que el último plato que agregaste aparezca arriba de todo en la lista (LIFO)
    return [...this.#items].reverse();
  }
}
//! PRUEBA
