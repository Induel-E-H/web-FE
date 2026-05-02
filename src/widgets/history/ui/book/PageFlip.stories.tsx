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
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div
        style={{
          position: 'relative',
          width: '260px',
          height: '380px',
          perspective: '1200px',
        }}
      >
        <PageFlip
          isFlipping={false}
          flipDirection='forward'
          flipDuration={800}
          flipFrontContent={<ListPage side='right' />}
          flipBackContent={<TimelinePage side='left' />}
          isRapidFlipping={false}
          isHoldChaining={false}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'forward 방향 플립 기본 상태. Controls에서 isFlipping을 true로 토글하면 애니메이션이 실행됩니다.',
      },
    },
  },
};

export const BackwardFlip: Story = {
  name: '뒤로 넘기기 (backward)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div
        style={{
          position: 'relative',
          width: '260px',
          height: '380px',
          perspective: '1200px',
        }}
      >
        <PageFlip
          isFlipping={false}
          flipDirection='backward'
          flipDuration={800}
          flipFrontContent={<TimelinePage side='left' />}
          flipBackContent={<ListPage side='right' />}
          isRapidFlipping={false}
          isHoldChaining={false}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story: 'backward 방향 플립.',
      },
    },
  },
};

export const RapidFlip: Story = {
  name: '고속 플립 (rapid)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div
        style={{
          position: 'relative',
          width: '260px',
          height: '380px',
          perspective: '1200px',
        }}
      >
        <PageFlip
          isFlipping={false}
          flipDirection='forward'
          flipDuration={300}
          flipFrontContent={<ListPage side='right' />}
          flipBackContent={<TimelinePage side='left' />}
          isRapidFlipping={true}
          isHoldChaining={false}
        />
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
