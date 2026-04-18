import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapCard } from './MapCard';

const meta: Meta<typeof MapCard> = {
  title: 'Widgets/Map/MapCard',
  component: MapCard,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MapCard>;

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
};
