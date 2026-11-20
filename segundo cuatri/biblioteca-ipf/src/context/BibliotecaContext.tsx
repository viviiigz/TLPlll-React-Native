import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CREDENCIALES_PERSONAL,
  DIAS_PRESTAMO,
  USUARIO_ACTUAL,
} from '../constants/tema';
import { LIBROS, LISTAS_ESPERA_INICIALES } from '../data/libros';
import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import {
  cancelarRecordatorio,
  enviarNotificacionEntrega,
  tienePermisoNotificaciones,
} from '../lib/notificaciones';
import { sumarDiasISO } from '../lib/validaciones';
import type {
  AvisoInterno,
  Libro,
  Prestamo,
  ResultadoEntrega,
  ResultadoReserva,
} from '../types';

const CLAVE_STORAGE = '@biblioteca_ipf_estado_v1';

type EstadoPersistido = {
  prestamos: Prestamo[];
  recientes: Libro[];
  avisosInternos: AvisoInterno[];
};

type ValorBibliotecaContext = {
  hidratado: boolean;
  prestamos: Prestamo[];
  recientes: Libro[];
  avisosInternos: AvisoInterno[];
  sesionPersonal: boolean;
  registrarVisto: (libro: Libro) => void;
  obtenerDisponibles: (libro: Libro) => number;
  obtenerCantidadEspera: (isbn: string) => number;
  obtenerFrenteEspera: (isbn: string) => string | undefined;
  obtenerPosicionUsuario: (isbn: string) => number | null;
  tienePrestamoActivo: (isbn: string) => boolean;
  obtenerLibrosConEspera: () => {
    libro: Libro;
    frente: string;
    cantidad: number;
  }[];
  obtenerMisReservasEnEspera: () => {
    libro: Libro;
    posicion: number;
    totalEnEspera: number;
  }[];
  reservarLibro: (isbn: string) => ResultadoReserva;
  devolverLibro: (isbn: string) => Promise<void>;
  actualizarRecordatorio: (
    isbn: string,
    activo: boolean,
    notificacionId: string | null,
  ) => void;
  entregarAlSiguiente: (isbn: string) => Promise<ResultadoEntrega>;
  descartarAviso: (id: string) => void;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
};

const BibliotecaContext = createContext<ValorBibliotecaContext | null>(null);

function crearColasIniciales(): Record<string, Cola<string>> {
  const resultado: Record<string, Cola<string>> = {};
  for (const [isbn, personas] of Object.entries(LISTAS_ESPERA_INICIALES)) {
    resultado[isbn] = new Cola<string>(personas);
  }
  return resultado;
}

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [hidratado, setHidratado] = useState<boolean>(false);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [pilaRecientes, setPilaRecientes] = useState<Pila<Libro>>(
    () => new Pila<Libro>(),
  );
  const [colasEspera, setColasEspera] = useState<Record<string, Cola<string>>>(
    () => crearColasIniciales(),
  );
  const [avisosInternos, setAvisosInternos] = useState<AvisoInterno[]>([]);
  const [sesionPersonal, setSesionPersonal] = useState<boolean>(false);

  useEffect(() => {
    let cancelado = false;

    async function cargarEstadoGuardado(): Promise<void> {
      try {
        const crudo = await AsyncStorage.getItem(CLAVE_STORAGE);
        if (crudo && !cancelado) {
          const guardado = JSON.parse(crudo) as Partial<EstadoPersistido>;
          if (Array.isArray(guardado.prestamos)) {
            setPrestamos(guardado.prestamos);
          }
          if (Array.isArray(guardado.recientes)) {
            const pila = new Pila<Libro>([...guardado.recientes].reverse());
            setPilaRecientes(pila);
          }
          if (Array.isArray(guardado.avisosInternos)) {
            setAvisosInternos(guardado.avisosInternos);
          }
        }
      } catch {
        // Si falla la lectura local, iniciamos con estado limpio.
      } finally {
        if (!cancelado) {
          setHidratado(true);
        }
      }
    }

    void cargarEstadoGuardado();

    return () => {
      cancelado = true;
    };
  }, []);

  const recientes = useMemo(() => pilaRecientes.aArray(), [pilaRecientes]);

  useEffect(() => {
    if (!hidratado) {
      return;
    }

    const payload: EstadoPersistido = {
      prestamos,
      recientes,
      avisosInternos,
    };

    void AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(payload)).catch(
      () => {
        // Ignoramos errores puntuales de almacenamiento local.
      },
    );
  }, [hidratado, prestamos, recientes, avisosInternos]);

  const registrarVisto = useCallback((libro: Libro) => {
    setPilaRecientes((actual) => {
      if (actual.tope()?.isbn === libro.isbn) {
        return actual;
      }
      const nueva = actual.clonar();
      nueva.push(libro);
      return nueva;
    });
  }, []);

  const obtenerDisponibles = useCallback(
    (libro: Libro): number => {
      const prestadosDeEsteLibro = prestamos.filter(
        (p) => p.isbn === libro.isbn,
      ).length;
      return Math.max(0, libro.ejemplares - prestadosDeEsteLibro);
    },
    [prestamos],
  );

  const obtenerCantidadEspera = useCallback(
    (isbn: string): number => colasEspera[isbn]?.tamanio ?? 0,
    [colasEspera],
  );

  const obtenerFrenteEspera = useCallback(
    (isbn: string): string | undefined => colasEspera[isbn]?.frente(),
    [colasEspera],
  );

  const obtenerPosicionUsuario = useCallback(
    (isbn: string): number | null => {
      const cola = colasEspera[isbn];
      if (!cola) {
        return null;
      }
      const indice = cola.aArray().indexOf(USUARIO_ACTUAL);
      return indice === -1 ? null : indice + 1;
    },
    [colasEspera],
  );

  const tienePrestamoActivo = useCallback(
    (isbn: string): boolean => prestamos.some((p) => p.isbn === isbn),
    [prestamos],
  );

  const obtenerLibrosConEspera = useCallback(() => {
    const lista: { libro: Libro; frente: string; cantidad: number }[] = [];
    for (const libro of LIBROS) {
      const cola = colasEspera[libro.isbn];
      const frente = cola?.frente();
      if (cola && frente && !cola.vacia) {
        lista.push({
          libro,
          frente,
          cantidad: cola.tamanio,
        });
      }
    }
    return lista;
  }, [colasEspera]);

  const obtenerMisReservasEnEspera = useCallback(() => {
    const lista: { libro: Libro; posicion: number; totalEnEspera: number }[] =
      [];
    for (const libro of LIBROS) {
      const posicion = obtenerPosicionUsuario(libro.isbn);
      if (posicion !== null) {
        lista.push({
          libro,
          posicion,
          totalEnEspera: obtenerCantidadEspera(libro.isbn),
        });
      }
    }
    return lista;
  }, [obtenerPosicionUsuario, obtenerCantidadEspera]);

  const reservarLibro = useCallback(
    (isbn: string): ResultadoReserva => {
      const libro = LIBROS.find((item) => item.isbn === isbn);
      if (!libro) {
        return {
          tipo: 'error',
          mensaje: 'No encontramos ese libro en el catálogo.',
        };
      }

      if (prestamos.some((p) => p.isbn === isbn)) {
        return {
          tipo: 'duplicado',
          mensaje: 'Ya tenés un préstamo activo de este libro.',
        };
      }

      const colaActual = colasEspera[isbn];
      if (colaActual && colaActual.aArray().includes(USUARIO_ACTUAL)) {
        return {
          tipo: 'duplicado',
          mensaje: 'Ya estás anotado en la lista de espera de este libro.',
        };
      }

      const disponibles = obtenerDisponibles(libro);
      if (disponibles > 0) {
        const nuevoPrestamo: Prestamo = {
          isbn: libro.isbn,
          titulo: libro.titulo,
          fechaPrestamoISO: new Date().toISOString(),
          fechaDevolucionISO: sumarDiasISO(DIAS_PRESTAMO),
          recordatorioActivo: false,
          notificacionId: null,
        };
        setPrestamos((prev) => [...prev, nuevoPrestamo]);
        return { tipo: 'prestamo', prestamo: nuevoPrestamo };
      }

      const nuevaCola = colaActual ? colaActual.clonar() : new Cola<string>();
      nuevaCola.encolar(USUARIO_ACTUAL);
      const posicion = nuevaCola.tamanio;

      setColasEspera((prev) => ({
        ...prev,
        [isbn]: nuevaCola,
      }));

      return { tipo: 'espera', posicion };
    },
    [prestamos, colasEspera, obtenerDisponibles],
  );

  const devolverLibro = useCallback(
    async (isbn: string): Promise<void> => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (prestamo?.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }
      setPrestamos((prev) => prev.filter((p) => p.isbn !== isbn));
    },
    [prestamos],
  );

  const actualizarRecordatorio = useCallback(
    (isbn: string, activo: boolean, notificacionId: string | null) => {
      setPrestamos((prev) =>
        prev.map((item) =>
          item.isbn === isbn
            ? { ...item, recordatorioActivo: activo, notificacionId }
            : item,
        ),
      );
    },
    [],
  );

  const entregarAlSiguiente = useCallback(
    async (isbn: string): Promise<ResultadoEntrega> => {
      const libro = LIBROS.find((item) => item.isbn === isbn);
      const tituloLibro = libro?.titulo ?? 'Libro';
      const colaActual = colasEspera[isbn];

      if (!colaActual || colaActual.vacia) {
        return {
          entregadoA: null,
          eraUsuarioActual: false,
          tituloLibro,
        };
      }

      const nuevaCola = colaActual.clonar();
      const persona = nuevaCola.desencolar() ?? null;

      setColasEspera((prev) => ({
        ...prev,
        [isbn]: nuevaCola,
      }));

      const eraUsuarioActual = persona === USUARIO_ACTUAL;

      if (eraUsuarioActual && libro) {
        const nuevoPrestamo: Prestamo = {
          isbn: libro.isbn,
          titulo: libro.titulo,
          fechaPrestamoISO: new Date().toISOString(),
          fechaDevolucionISO: sumarDiasISO(DIAS_PRESTAMO),
          recordatorioActivo: false,
          notificacionId: null,
        };
        setPrestamos((prev) =>
          prev.some((p) => p.isbn === isbn) ? prev : [...prev, nuevoPrestamo],
        );

        const permitido = await tienePermisoNotificaciones();
        if (permitido) {
          await enviarNotificacionEntrega(tituloLibro, isbn);
        } else {
          const aviso: AvisoInterno = {
            id: `${isbn}-${Date.now()}`,
            mensaje: `Tu reserva de "${tituloLibro}" ya fue entregada desde el mostrador y pasó a tus préstamos.`,
            fechaISO: new Date().toISOString(),
          };
          setAvisosInternos((prev) => [aviso, ...prev]);
        }
      }

      return {
        entregadoA: persona,
        eraUsuarioActual,
        tituloLibro,
      };
    },
    [colasEspera],
  );

  const descartarAviso = useCallback((id: string) => {
    setAvisosInternos((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const iniciarSesion = useCallback((usuario: string, clave: string): boolean => {
    const esValido =
      usuario.trim().toLowerCase() === CREDENCIALES_PERSONAL.usuario &&
      clave === CREDENCIALES_PERSONAL.clave;

    if (esValido) {
      setSesionPersonal(true);
    }
    return esValido;
  }, []);

  const cerrarSesion = useCallback(() => {
    setSesionPersonal(false);
  }, []);

  const valor = useMemo<ValorBibliotecaContext>(
    () => ({
      hidratado,
      prestamos,
      recientes,
      avisosInternos,
      sesionPersonal,
      registrarVisto,
      obtenerDisponibles,
      obtenerCantidadEspera,
      obtenerFrenteEspera,
      obtenerPosicionUsuario,
      tienePrestamoActivo,
      obtenerLibrosConEspera,
      obtenerMisReservasEnEspera,
      reservarLibro,
      devolverLibro,
      actualizarRecordatorio,
      entregarAlSiguiente,
      descartarAviso,
      iniciarSesion,
      cerrarSesion,
    }),
    [
      hidratado,
      prestamos,
      recientes,
      avisosInternos,
      sesionPersonal,
      registrarVisto,
      obtenerDisponibles,
      obtenerCantidadEspera,
      obtenerFrenteEspera,
      obtenerPosicionUsuario,
      tienePrestamoActivo,
      obtenerLibrosConEspera,
      obtenerMisReservasEnEspera,
      reservarLibro,
      devolverLibro,
      actualizarRecordatorio,
      entregarAlSiguiente,
      descartarAviso,
      iniciarSesion,
      cerrarSesion,
    ],
  );

  return (
    <BibliotecaContext.Provider value={valor}>
      {children}
    </BibliotecaContext.Provider>
  );
}

export function useBiblioteca(): ValorBibliotecaContext {
  const contexto = useContext(BibliotecaContext);
  if (!contexto) {
    throw new Error('useBiblioteca debe usarse dentro de BibliotecaProvider.');
  }
  return contexto;
}
