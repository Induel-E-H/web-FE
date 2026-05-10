export const MAP_STATE = {
  LOADING: 'loading',
  READY: 'ready',
  FALLBACK: 'fallback',
};

export type MapState = (typeof MAP_STATE)[keyof typeof MAP_STATE];
