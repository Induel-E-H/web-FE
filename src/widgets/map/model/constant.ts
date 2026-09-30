export const MAP_STATE = {
  LOADING: 'loading',
  READY: 'ready',
  FALLBACK: 'fallback',
};

export type MapState = (typeof MAP_STATE)[keyof typeof MAP_STATE];

export const NAVER_DIRECTIONS_URL =
  'https://map.naver.com/p/directions/-/3AIz83,2z81dR,%EC%9D%B8%EB%93%A4%EC%9D%B4%EC%95%A4%EC%97%90%EC%9D%B4%EC%B9%98,13065934,PLACE_POI/-/walk?c=15.00,0,0,0,dh';
