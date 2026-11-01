import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the CodeQuizzer home page', () => {
  render(<App />);
  expect(screen.getByText(/Think sharper/i)).toBeInTheDocument();
});
