import type { IconType } from 'react-icons';
import {
  MdChevronRight,
  MdFastForward,
  MdOutlineKeyboard,
  MdOutlineListAlt,
  MdOutlinePanTool,
  MdOutlineSwipeLeft,
  MdOutlineTouchApp,
} from 'react-icons/md';

import '../../styles/book/UsageGuide.css';

type Usage = { icon: IconType; label: string; description: string };

const TABLE_OF_CONTENTS: Usage = {
  icon: MdOutlineListAlt,
  label: '목차로 이동',
  description:
    '목차 페이지의 "작품명"을 누르면 그 작품 페이지로 넘어가요.\n위쪽 목차 · 본문 · 연혁 · 주요 성과 탭도 같아요.',
};

const SPREAD_USAGES: readonly Usage[] = [
  {
    icon: MdOutlineTouchApp,
    label: '클릭',
    description: '페이지를 클릭하면 한 장씩 넘어가요.',
  },
  {
    icon: MdOutlinePanTool,
    label: '잡고 드래그',
    description: '페이지를 잡고 끌면 손을 따라 넘어가요.',
  },
  {
    icon: MdFastForward,
    label: '꾹 누르기',
    description: '왼쪽·오른쪽 페이지를 꾹 누르고 있으면 빠르게 넘어가요.',
  },
  {
    icon: MdOutlineKeyboard,
    label: '키보드',
    description:
      '책을 클릭하거나 Tab 으로 선택한 뒤 ← → 로 한 장씩,\nHome · End 로 처음과 끝으로 가요.',
  },
  TABLE_OF_CONTENTS,
];

const HALF_USAGES: readonly Usage[] = [
  {
    icon: MdOutlineSwipeLeft,
    label: '밀어서 넘기기',
    description: '옆으로 밀면 다음 장·이전 장으로 넘어가요.',
  },
  {
    icon: MdChevronRight,
    label: '버튼',
    description: '화면 아래 ‹ › 버튼으로도 넘길 수 있어요.',
  },
  {
    icon: MdFastForward,
    label: '꾹 누르기',
    description: '화면 왼쪽·오른쪽을 꾹 누르고 있으면 빠르게 넘어가요.',
  },
  TABLE_OF_CONTENTS,
];

/** 앞표지 안쪽에 적힌 책 넘기는 방법. 가로(PC)와 반쪽 보기(태블릿/모바일)의 조작이 달라 따로 안내한다. */
export function UsageGuide({ landscape }: { landscape: boolean }) {
  const usages = landscape ? SPREAD_USAGES : HALF_USAGES;

  return (
    <div className='history__usage'>
      <h3 className='history__usage-title'>Book Guide</h3>
      <dl className='history__usage-list'>
        {usages.map(({ icon: Icon, label, description }) => (
          <div key={label} className='history__usage-item'>
            <dt>
              <Icon aria-hidden='true' />
              {label}
            </dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
