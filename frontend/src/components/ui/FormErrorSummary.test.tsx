import { render, screen } from '@testing-library/react';
import { FormErrorSummary } from '@ui/FormErrorSummary';

describe('FormErrorSummary', () => {
  it('renders nothing when there are no errors', () => {
    const { container } = render(<FormErrorSummary count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('counts a single field in the singular', () => {
    render(<FormErrorSummary count={1} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Revisa 1 campo antes de continuar');
  });

  it('counts several fields in the plural', () => {
    render(<FormErrorSummary count={3} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Revisa 3 campos antes de continuar');
  });

  // Only the icon is red: the field errors already carry the red, a red line here doubles it
  it('keeps the text neutral and the icon red', () => {
    render(<FormErrorSummary count={2} />);
    const summary = screen.getByRole('alert');
    expect(summary).toHaveClass('text-ink-2');
    expect(summary).not.toHaveClass('text-alert');
    expect(summary.querySelector('[aria-hidden="true"]')).toHaveClass('text-alert');
  });
});
