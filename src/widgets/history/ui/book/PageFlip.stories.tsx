import type { Meta, StoryObj } from '@storybook/react-vite';

import { ListPage } from './content_container/List';
import { TimelinePage } from './content_container/Timeline';
import { PageFlip } from './PageFlip';

const meta = {
  title: 'Widgets/History/Book/PageFlip',
  component: PageFlip,
  args: {
    isFlipping: false,
    flipDirection: 'forward',
    flipDuration: 800,
    flipFrontContent: null,
    flipBackContent: null,
    isRapidFlipping: false,
    isHoldChaining: false,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지 플립 애니메이션 컴포넌트. 책 페이지 간 3D 전환을 담당합니다. isFlipping=true 시 flipDirection에 따라 앞으로(forward) 또는 뒤로(backward) 플립합니다.',
      },
    },
  },
} satisfies Meta<typeof PageFlip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForwardFlip: Story = {
  name: '앞으로 넘기기 (forward)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div
        className='history__book-right'
        style={{ position: 'relative', width: '620px', height: '662.5px' }}
      >
        <div className='history__book-page-flip-wrapper'>
          <PageFlip
            isFlipping={true}
            flipDirection='forward'
            flipDuration={800}
            flipFrontContent={<ListPage side='right' />}
            flipBackContent={<TimelinePage side='left' />}
            isRapidFlipping={false}
            isHoldChaining={false}
          />
        </div>
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'forward 방향 플립. 오른쪽 페이지가 왼쪽으로 넘어가는 애니메이션입니다.',
      },
    },
  },
};

export const BackwardFlip: Story = {
  name: '뒤로 넘기기 (backward)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div
        className='history__book-left'
        style={{ position: 'relative', width: '620px', height: '662.5px' }}
      >
        <div className='history__book-page-flip-wrapper'>
          <PageFlip
            isFlipping={true}
            flipDirection='backward'
            flipDuration={800}
            flipFrontContent={<TimelinePage side='left' />}
            flipBackContent={<ListPage side='right' />}
            isRapidFlipping={false}
            isHoldChaining={false}
          />
        </div>
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'backward 방향 플립. 왼쪽 페이지가 오른쪽으로 넘어가는 애니메이션입니다.',
      },
    },
  },
};

export const RapidFlip: Story = {
  name: '고속 플립 (rapid)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div
        className='history__book-right'
        style={{ position: 'relative', width: '620px', height: '662.5px' }}
      >
        <div className='history__book-page-flip-wrapper'>
          <PageFlip
            isFlipping={true}
            flipDirection='forward'
            flipDuration={300}
            flipFrontContent={<ListPage side='right' />}
            flipBackContent={<TimelinePage side='left' />}
            isRapidFlipping={true}
            isHoldChaining={false}
          />
        </div>
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'isRapidFlipping=true 시 CSS transition이 300ms로 단축됩니다. 카테고리 점프 등에 사용됩니다.',
      },
    },
  },
};
