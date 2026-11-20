export class Cola<T> {
  #items: (T | undefined)[] = [];
  #frenteIndex = 0;

  constructor(iniciales?: T[]) {
    if (iniciales) {
      this.#items = [...iniciales];
    }
  }

  encolar(elemento: T): void {
    this.#items.push(elemento);
  }

  desencolar(): T | undefined {
    if (this.vacia) {
      return undefined;
    }

    const elemento = this.#items[this.#frenteIndex];
    this.#items[this.#frenteIndex] = undefined;
    this.#frenteIndex += 1;

    if (this.#frenteIndex > 50 && this.#frenteIndex * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#frenteIndex);
      this.#frenteIndex = 0;
    }

    return elemento;
  }

  frente(): T | undefined {
    if (this.vacia) {
      return undefined;
    }
    return this.#items[this.#frenteIndex];
  }

  get vacia(): boolean {
    return this.#frenteIndex >= this.#items.length;
  }

  get tamanio(): number {
    return this.#items.length - this.#frenteIndex;
  }

  aArray(): T[] {
    const resultado: T[] = [];
    for (let i = this.#frenteIndex; i < this.#items.length; i += 1) {
      const actual = this.#items[i];
      if (actual !== undefined) {
        resultado.push(actual);
      }
    }
    return resultado;
  }

  clonar(): Cola<T> {
    return new Cola<T>(this.aArray());
  }
}

