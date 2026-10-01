import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../styles/History.css';
import { ColophonPage } from './ColophonPage';

const meta = {
  title: 'Widgets/History/Book/ColophonPage',
  component: ColophonPage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '뒤표지 안쪽 맞은편에 오는 뒤 속지(판권면). 회사명, 사업 분야, 회사 정보를 표시합니다.',
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
} satisfies Meta<typeof ColophonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
