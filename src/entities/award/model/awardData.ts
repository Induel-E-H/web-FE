export type AwardItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  serialNumber?: string;
  issuer: string;
};

export const AWARD_LIST: AwardItem[] = [
  {
    id: 0,
    title: '유엔기념공원 관리처 기념관 내부 전시실공사 제안 공모전',
    category: '당선증',
    date: '2003. 08. 18',
    serialNumber: '제 13호',
    issuer: '재한유엔기념공원관리처장',
  },
  {
    id: 1,
    title: '낙동강에코 센터 내부전시 시설 국내 공모전',
    category: '당선증',
    date: '2004. 12. 27',
    serialNumber: '제 3226호',
    issuer: '부산광역시장 허남식',
  },
  {
    id: 2,
    title: '국제경기대회 기념자료 전시관 설치 공사 설계 경기 공모전',
    category: '당선증',
    date: '2005. 07. 27',
    issuer: '부산광역시장 허남식',
  },
  {
    id: 3,
    title: '2005 APEC 정상회의장내 도시 홍보물 설치 및 기념사업 현상 공모전',
    category: '당선증',
    date: '2005. 09. 14',
    issuer: '(주) 부산전시ㆍ컨벤션센터 대표이사 정해수',
  },
  {
    id: 4,
    title: '2005 APEC 정상회의장 디스플레이 현상 공모전',
    category: '당선증',
    date: '2005. 10. 10',
    issuer: '(주) 부산전시ㆍ컨벤션센터 대표이사 정해수',
  },
  {
    id: 5,
    title: '부산경남경마공원 정문조형물 출품 공모 작품 심사',
    category: '당선작',
    date: '2006. 07. 27',
    serialNumber: '제 1호',
    issuer: 'KRA 부산경남본부장',
  },
  {
    id: 6,
    title: '해기사 명예의 전당 조형물 현상 공모전',
    category: '우수작',
    date: '2008. 03. 05',
    serialNumber: '제 1556호',
    issuer: '부산지방해양항만청장 곽인섭',
  },
  {
    id: 7,
    title: '국제경기대회기념전시관 시설공사',
    category: '표창장',
    date: '2008. 07. 25',
    serialNumber: '제 1681호',
    issuer: '부산광역시장 허남식',
  },
];
