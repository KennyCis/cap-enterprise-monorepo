// frontend/web-app/src/pages/Login.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Login from './Login';

describe('Login Component', () => {
  it('renders the login form correctly', () => {
   
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
   
    expect(screen.getByText('CAP Platform')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
});