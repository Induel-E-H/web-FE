import type { IconType } from 'react-icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdDirectionsBus, MdSubway } from 'react-icons/md';

export type TransportItem = {
  id: string;
  Icon: IconType;
  label: string;
  lines: string[];
};

export const TRANSPORT_ITEMS: TransportItem[] = [
  {
    id: 'map__walk',
    Icon: FaMapMarkerAlt,
    label: '도보',
    lines: [
      '부산 남구 수영로 274-16 (우) 48498',
      '프렌즈 스크린 부산 대연점 옆 건물',
    ],
  },
  {
    id: 'map__bus',
    Icon: MdDirectionsBus,
    label: '버스',
    lines: ['대연역 정거장 (211m)', '경성대학교 정거장 (278m)'],
  },
  {
    id: 'map__subway',
    Icon: MdSubway,
    label: '지하철',
    lines: ['2호선 경성대부경대역 5번 출구 (348m)'],
  },
];
