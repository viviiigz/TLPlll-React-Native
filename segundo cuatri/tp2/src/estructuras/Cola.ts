export class Cola<T> {
  //* Le decimos que el array guardará elementos de tipo t, que la fila puede ser de cualquier cosa(textos, numeros, objetos)
  #items: (T | undefined)[] = []; //fila de por ejemplo sillas vacias y el ## que asegura que nadie de afuera pueda emtrar o correr a alguien de su silla(array privado)
  #frenteIndex: number = 0; //todo está atento a quien queda en el frente

  //todo Se especifica que el elemento entrante es de tipo T
  encolar(elemento: T): void {
    this.#items.push(elemento); //tomamos el elemento nuevo y lo ubicamos en la siguiente silla libre(al final)
  }

  desencolar(): T | undefined { //! atendemos al primero en la cola
    if (this.vacia) return undefined; //si no hay nadie esperando no hacemos nada devolvemos undefined
    
    const elemento = this.#items[this.#frenteIndex]; //* miramos quien esta esperando en la silla que marca el frenteIndex y lo guardamos en una variable
    this.#items[this.#frenteIndex] = undefined;  //!eliminamos el elemento de frnete en la cola marcandolo como undefined 
    
    this.#frenteIndex++; //todo avanza al puntero al frente, como ya marcamos la posicion anterior como undefided, ahora el frente pasa al sigueinte indice 
    return elemento;
  }

  frente(): T | undefined {
    if (this.vacia) return undefined; // si la cola está vacía, no hay nadie que mirar, devuelve undefined.
    return this.#items[this.#frenteIndex]; //!si hay elementos, devuelve solo el valor del elemento que está al frente
  }

  get vacia(): boolean {
    return this.#frenteIndex >= this.#items.length;    //todo como los elementos "eliminados" solo se marcan como undefined pero sigeun el array
    //todo la cola estará vacía recien cuando el frenteIndex llega al finl del array >= this.#items.length
  }

  get tamanio(): number {
    return this.#items.length - this.#frenteIndex; //calculo para ver cuantos elementos activos hay como frenteIndex apunta al primer
    //elemento vivo, la cantidad real seria length - frenteIndex pq descarta los huecos undefined del inicio 
  }

  aArray(): (T | undefined)[] {
    return this.#items.slice(this.#frenteIndex); // devolcemos una copia de solo los elementos restantes desde frenteIndex hasta el dinal
  }
}


//! PRUEBA

const chicas = new Cola<string>();

chicas.encolar("Ana");
chicas.encolar("Kiara");
chicas.encolar("Luana");
chicas.encolar("Stella");


console.log("Primera en la fila: :", chicas.desencolar()); //tiene que estar ana
console.log("Primera en la fila: :", chicas.desencolar());  //queda kiara

console.log("En espera:", chicas.aArray()); //luana y stella 
console.log("Tamaño: ", chicas.tamanio); // 2 