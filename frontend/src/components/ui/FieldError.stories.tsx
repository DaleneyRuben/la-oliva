import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldError } from '@ui/FieldError';

const meta: Meta<typeof FieldError> = {
  component: FieldError,
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FieldError>;

export const Default: Story = {
  args: {
    children: 'Nombre es requerido',
  },
};
