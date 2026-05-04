export const initialState = {
  maquillajes: [],
  cargando: true,
  error: null,
};

export const ACTIONS = {
  SET_MAQUILLAJES: 'SET_MAQUILLAJES',
  SET_CARGANDO: 'SET_CARGANDO',
  SET_ERROR: 'SET_ERROR',
  AGREGAR_MAQUILLAJE: 'AGREGAR_MAQUILLAJE',
  EDITAR_MAQUILLAJE: 'EDITAR_MAQUILLAJE',
  BORRAR_MAQUILLAJE: 'BORRAR_MAQUILLAJE',
};

export const maquillajesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_MAQUILLAJES:
      return { ...state, maquillajes: action.payload };
    case ACTIONS.SET_CARGANDO:
      return { ...state, cargando: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.AGREGAR_MAQUILLAJE:
      return { ...state, maquillajes: [...state.maquillajes, action.payload] };
    case ACTIONS.EDITAR_MAQUILLAJE:
      return {
        ...state,
        maquillajes: state.maquillajes.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case ACTIONS.BORRAR_MAQUILLAJE:
      return {
        ...state,
        maquillajes: state.maquillajes.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};