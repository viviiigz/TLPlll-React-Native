import { describe, expect, it } from '@jest/globals';
import { Cola } from '../Cola';
import { Pila } from '../Pila';

describe('Pila', () => {
  it('apila y desapila respetando el orden LIFO', () => {
    const pila = new Pila<string>();
    pila.push('Ficciones');
    pila.push('Rayuela');
    pila.push('1984');

    expect(pila.tamanio).toBe(3);
    expect(pila.tope()).toBe('1984');
    expect(pila.pop()).toBe('1984');
    expect(pila.pop()).toBe('Rayuela');
    expect(pila.tamanio).toBe(1);
  });

  it('devuelve undefined al hacer pop o tope en una pila vacía', () => {
    const pila = new Pila<number>();

    expect(pila.vacia).toBe(true);
    expect(pila.tope()).toBeUndefined();
    expect(pila.pop()).toBeUndefined();
    expect(pila.tamanio).toBe(0);
  });

  it('aArray devuelve del más reciente al más antiguo sin exponer el estado interno', () => {
    const pila = new Pila<string>(['A', 'B', 'C']);
    const copia = pila.aArray();

    expect(copia).toEqual(['C', 'B', 'A']);
    copia.push('Z');
    expect(pila.tamanio).toBe(3);
  });

  it('clonar crea una instancia independiente', () => {
    const original = new Pila<string>(['A']);
    const clon = original.clonar();
    clon.push('B');

    expect(original.tamanio).toBe(1);
    expect(clon.tamanio).toBe(2);
  });
});

describe('Cola', () => {
  it('encola y desencola respetando el orden FIFO sin usar shift', () => {
    const cola = new Cola<string>();
    cola.encolar('Ana');
    cola.encolar('Lucas');
    cola.encolar('Sofía');

    expect(cola.tamanio).toBe(3);
    expect(cola.frente()).toBe('Ana');
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.frente()).toBe('Lucas');
    expect(cola.tamanio).toBe(2);
  });

  it('devuelve undefined al desencolar o consultar frente en una cola vacía', () => {
    const cola = new Cola<string>();

    expect(cola.vacia).toBe(true);
    expect(cola.frente()).toBeUndefined();
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
  });

  it('queda vacía después de desencolar todos los elementos', () => {
    const cola = new Cola<string>(['Ana', 'Lucas']);
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.desencolar()).toBe('Lucas');
    expect(cola.vacia).toBe(true);
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.aArray()).toEqual([]);
  });

  it('clonar crea una copia independiente de los elementos activos', () => {
    const original = new Cola<string>(['Ana', 'Lucas']);
    original.desencolar();
    const clon = original.clonar();
    clon.encolar('Sofía');

    expect(original.aArray()).toEqual(['Lucas']);
    expect(clon.aArray()).toEqual(['Lucas', 'Sofía']);
  });
});
