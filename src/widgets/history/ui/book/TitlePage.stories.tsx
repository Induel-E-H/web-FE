import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../styles/History.css';
import { TitlePage } from './TitlePage';

const meta = {
  title: 'Widgets/History/Book/TitlePage',
  component: TitlePage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '앞표지 안쪽 맞은편에 오는 속지(제목 페이지). 표지와 List 사이를 분리합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <section
        className='history'
        style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
      >
        <div
          style={{
            width: '620px',
            height: '662.5px',
            backgroundColor: 'var(--white)',
          }}
        >
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof TitlePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
