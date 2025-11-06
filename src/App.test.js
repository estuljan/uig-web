import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dictionary title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /uyghur dictionary/i });
  expect(heading).toBeInTheDocument();
});
