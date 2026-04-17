export type PatentValidType = {
  serialNumber: string;
  applicationNumber: string;
  filingDate: string;
  registrationDate: string;
  title: string;
};

export const PATENT_VALID_LIST: PatentValidType[] = [
  {
    serialNumber: '제 10-1506087호',
    applicationNumber: '제 10-2013-0112981호',
    filingDate: '2013. 09. 24',
    registrationDate: '2015. 03. 19',
    title: '신체적 약자를 위한 일체형 다용도 화장대',
  },
  {
    serialNumber: '제 10-1053684호',
    applicationNumber: '제 10-2008-0138751호',
    filingDate: '2008. 12. 31',
    registrationDate: '2011. 07. 27',
    title: '다기능 책장',
  },
  {
    serialNumber: '제 10-0942306호',
    applicationNumber: '제 10-2007-0136793호',
    filingDate: '2007. 12. 24',
    registrationDate: '2010. 02. 05',
    title: '서랍식 발코니',
  },
  {
    serialNumber: '제 10-0909937호',
    applicationNumber: '제 10-2007-0117392호',
    filingDate: '2007. 11. 16',
    registrationDate: '2009. 07. 22',
    title: '이동식 테이블',
  },
  {
    serialNumber: '제 10-0909936호',
    applicationNumber: '제 10-2007-0117389호',
    filingDate: '2007. 11. 16',
    registrationDate: '2009. 07. 22',
    title: '공간 절약형 다기능 가구',
  },
];

export type PatentExpireType = {
  serialNumber: string;
  title: string;
};

export const PATENT_EXPIRE_LIST: PatentExpireType[] = [
  {
    serialNumber: '10-1062216',
    title: '의자',
  },
  {
    serialNumber: '10-1199714',
    title: '측면으로 인출되는 선반을 구비한 다목적 수납장',
  },
  {
    serialNumber: '10-1311049',
    title: '전원접속 모듈형 전시진열장',
  },
  {
    serialNumber: '10-1294889',
    title: '가구 내장형 시스템 전시부스',
  },
  {
    serialNumber: '10-1294980',
    title: '재해지역을 위한 이동가능한 박스 형태의 간이 병동',
  },
  {
    serialNumber: '10-1300847',
    title: '공간절약형 응급실 의료침대',
  },
  {
    serialNumber: '10-1556853',
    title: '다기능 진료테이블',
  },
  {
    serialNumber: '10-1557931',
    title: '가정용 스파부스',
  },
  {
    serialNumber: '10-1550858',
    title: '공간 활용을 위한 병실용 다목적 시스템 가구',
  },
  {
    serialNumber: '10-1484409',
    title: '소규모 주택을 위한 다용도 책장',
  },
];
