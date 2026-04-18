import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapTitle } from './Title';

const meta: Meta<typeof MapTitle> = {
  title: 'Widgets/Map/MapTitle',
  component: MapTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '지도 위젯의 제목 부분 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MapTitle>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '지도 제목',
      },
    },
  },
};
