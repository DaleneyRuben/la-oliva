import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormErrorSummary } from '@ui/FormErrorSummary';

const meta: Meta<typeof FormErrorSummary> = {
  component: FormErrorSummary,
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormErrorSummary>;

export const OneField: Story = {
  args: { count: 1 },
};

export const SeveralFields: Story = {
  args: { count: 3 },
};
